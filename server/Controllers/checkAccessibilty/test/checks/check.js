const { AxePuppeteer } = require('@axe-core/puppeteer');
const { mkdir, writeFileSync } = require('fs');
const types = require('../issuesTypes/types');
const { join } = require('path');

async function getDisabilitiesAffected(id) {
    //check which Disabilities Affected by the issue
    const DisabilitiesAffected = []
    for (const key in types) {
        if (types.hasOwnProperty(key)) {
            const items = types[key];
            if (items.includes(id)) {
                DisabilitiesAffected.push(key)
            }
        }
    }
    return DisabilitiesAffected
}


module.exports.checkAccessibility = async (page, url, standard) => {

    // set up check configuration
    const accessibilityOptions = {
        xpath: true,
        absolutePaths: true,
        reporter: 'v2',
        runOnly: standard === "WCAG" ? ['cat.*', 'wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'best-practice'] : ['cat.*', 'section508', 'section508.*.*']
    };

    // lunch the check
    const accessibilityResults = await new AxePuppeteer(page)
        .options(accessibilityOptions)
        .analyze();

    // create new directory to store cpatured elements 
    // const now = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');
    // const path = join('uploads', new URL(url).hostname + ' - ' + now);
    // mkdir(path, { recursive: true }, (err) => {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log('Directory created successfully!');
    // });

    const failed = await Promise.all(accessibilityResults.violations.map(async (violation) => {

        const disabilitiesAffected = await getDisabilitiesAffected(violation.id)
        const issues = await Promise.all(violation.nodes.map(async (node, index) => {
            if (!page.isClosed()) {

                const target = node.target
                //await elementPositioning(target, page, path, index)

                return {
                    target: node.html,
                    toBeFixed: await Promise.all(node.any.map(async (related) => {

                        return {
                            message: related.message,
                            relatedNodes: related.relatedNodes.length > 0 ? await Promise.all(related.relatedNodes.map(async (relatedNodes, index) => {
                                //await elementPositioning(relatedNodes.target, page, path, index)

                                return {
                                    target: relatedNodes.html,
                                };
                            })) : []
                        };
                    })),
                };
            }
            return null;
        }));

        return {
            impact: violation.impact,
            title: violation.help,
            id: violation.id,
            disabilitiesAffected: disabilitiesAffected,
            description: violation.description,
            issues: issues.filter((item) => item !== null)
        };
    }));

    const passed = await Promise.all(accessibilityResults.passes.map(async (passed) => {
        return {
            check: "[" + passed.id + "] " + passed.description,
            disabilitiesAffected: await getDisabilitiesAffected(passed.id),
            description: passed.help
        }
    }));

    const score = await calculateAccessibilityScore(failed)

    const failedSize = failed.length
    const passedSize = passed.length
    return [failed, passed, failedSize, passedSize, score];
}

const weights = {
    critical: 0.35,
    serious: 0.30,
    moderate: 0.20,
    minor: 0.15,
};

const calculateAccessibilityScore = async (failed) => {

    const totalViolation = failed.length
    if (totalViolation === 0) {
        return 100
    }
    const criteriaScores = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0,
    };

    failed.forEach((violation) => {
        criteriaScores[violation.impact] += 1;
    });

    let weightedSum = 0;
    Object.keys(weights).forEach((criterion) => {
        weightedSum += (criteriaScores[criterion] / totalViolation) * weights[criterion];
    });

    const accessibilityScore = (1 - weightedSum) * 100;
    return Math.round(accessibilityScore);
};

// async function elementPositioning(tagetedElement, page, path, index) {
//     const target = tagetedElement.toString();
//     const element = await page.$(target)

//     if (element) {
//         const boundingBox = await element.boundingBox()

//         if (boundingBox !== null) {

//             try {
//                 await element.hover()

//                 const screenshot = await page.screenshot({
//                     clip: {
//                         x: boundingBox.x + 50,
//                         y: boundingBox.y + 50,
//                         width: boundingBox.width + 20,
//                         height: boundingBox.height + 20,
//                     },
//                     omitBackground: true, // remove the background

//                 });
//                 writeFileSync(join(path, index + '.png'), screenshot);

//             } catch (error) {

//                 if (error.message.includes('Node is either not clickable or not an HTMLElement')) {
//                     const screenshot = await page.screenshot({
//                         clip: {
//                             x: boundingBox.x, // add a small margin to the left and right
//                             y: boundingBox.y, // add a small margin to the top and bottom
//                             width: boundingBox.width + 20,
//                             height: boundingBox.height + 20,
//                         },
//                         omitBackground: true, // remove the background

//                     });
//                     writeFileSync(join(path, index + '.png'), screenshot);
//                 }

//             }
//         }


//     }
//     else {
//         console.log("not found")
//     }
// }