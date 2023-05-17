const { AxePuppeteer } = require('@axe-core/puppeteer');
const { mkdir, writeFileSync } = require('fs');
const types = require('../issuesTypes/types');
const { join } = require('path');

async function getDisabilitiesAffected(id) {//check which Disabilities Affected by the issue
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


async function elementPositioning(tagetedElement, page, path, index) {
    const target = tagetedElement.toString();
    const element = await page.$(target)

    if (element) {
        const boundingBox = await element.boundingBox()

        if (boundingBox !== null) {

            try {
                await element.hover()

                const screenshot = await page.screenshot({
                    clip: {
                        x: boundingBox.x + 50,
                        y: boundingBox.y + 50,
                        width: boundingBox.width + 20,
                        height: boundingBox.height + 20,
                    },
                    omitBackground: true, // remove the background

                });
                writeFileSync(join(path, index + '.png'), screenshot);

            } catch (error) {

                if (error.message.includes('Node is either not clickable or not an HTMLElement')) {
                    const screenshot = await page.screenshot({
                        clip: {
                            x: boundingBox.x, // add a small margin to the left and right
                            y: boundingBox.y, // add a small margin to the top and bottom
                            width: boundingBox.width + 20,
                            height: boundingBox.height + 20,
                        },
                        omitBackground: true, // remove the background

                    });
                    writeFileSync(join(path, index + '.png'), screenshot);
                }

            }
        }


    }
    else {
        console.log("not found")
    }
}

module.exports.checkAccessibility = async (page, url) => {

    // set up check configuration
    const accessibilityOptions = {
        xpath: true,
        absolutePaths: true,
        reporter: 'v2',
        runOnly: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'best-practice']
    };

    // lunch the check
    const accessibilityResults = await new AxePuppeteer(page)
        .options(accessibilityOptions)
        .analyze();

    // create new directory to store cpatured elements 
    const now = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');
    const path = join('uploads', new URL(url).hostname + ' - ' + now);
    mkdir(path, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    });

    const failed = await Promise.all(accessibilityResults.violations.map(async (violation) => {

        const disabilitiesAffected = await getDisabilitiesAffected(violation.id)
        const issues = await Promise.all(violation.nodes.map(async (node, index) => {
            if (!page.isClosed()) {
                console.log(node.data)

                const target = node.target
                await elementPositioning(target, page, path, index)

                return {
                    target: node.html,
                    toBeFixed: await Promise.all(node.any.map(async (related) => {

                        console.log(related.data)
                        return {
                            message: related.message,
                            relatedNodes: related.relatedNodes.length > 0 ? await Promise.all(related.relatedNodes.map(async (relatedNodes, index) => {
                                await elementPositioning(relatedNodes.target, page, path, index)

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
            disabilitiesAffected,
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

    const failedSize = failed.length
    const passedSize = passed.length
    return [failed, passed, failedSize, passedSize];
}
