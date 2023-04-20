const { AxePuppeteer } = require('@axe-core/puppeteer');
const { mkdir, writeFileSync } = require('fs');
const { join } = require('path');

async function canHover(element, page) {
    const isHoverable = await page.evaluate(element => {
        if (!element) {
            return false; // Element not found
        }
        const { width, height } = element.getBoundingClientRect();
        if (width === 0 || height === 0) {
            return false; // Element has no dimensions
        }
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
            return false; // Element is hidden
        }
        const hasPointerEvents = style.pointerEvents !== 'none';
        if (!hasPointerEvents) {
            return false; // Pointer events are disabled
        }
        const hasNonStaticPosition = style.position !== 'static';
        if (!hasNonStaticPosition) {
            return false; // Element does not have a non-static position
        }
        return true;
    }, element);
    return isHoverable;
}

module.exports.checkAccessibility = async (page, url) => {
    const accessibilityOptions = {
        xpath: true,
        absolutePaths: true,
        reporter: 'v2'
    };
    const accessibilityResults = await new AxePuppeteer(page)
        .options(accessibilityOptions)
        .analyze();


    const now = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '');
    const path = join('uploads', url.replace(/\//g, '\\') + ' - ' + now);
    mkdir(path, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    });
    const results = await Promise.all(accessibilityResults.violations.map(async (violation) => {
        const issue = await Promise.all(violation.nodes.map(async (node) => {
            if (!page.isClosed()) {
                const target = node.target.toString();
                const element = await page.$(target)
                const canBeHovered = await canHover(element, page)
                let boundingBox = null
                if (element) {
                    try {

                        boundingBox = await element.boundingBox()
                        if (canBeHovered) {
                            await element.hover()

                            const screenshot = await page.screenshot({
                                clip: {
                                    x: boundingBox.x, // add a small margin to the left and right
                                    y: boundingBox.y, // add a small margin to the top and bottom
                                    width: boundingBox.width + 20,
                                    height: boundingBox.height + 20,
                                },
                                omitBackground: true, // remove the background

                            });
                            writeFileSync(join(path, target + '.png'), screenshot);
                        }
                        else {


                            const screenshot = await page.screenshot({
                                clip: {
                                    x: boundingBox.x, // add a small margin to the left and right
                                    y: boundingBox.y, // add a small margin to the top and bottom
                                    width: boundingBox.width + 20,
                                    height: boundingBox.height + 20,
                                },
                                omitBackground: true, // remove the background

                            });
                            writeFileSync(join(path, target + '.png'), screenshot);

                        }

                    } catch (error) {
                        //wll be added later !important
                    }
                }
                else {
                    boundingBox = null
                }

                return {
                    target,
                    boundingBox,
                    toBeFixed: await Promise.all(node.any.map(async (related) => {
                        return {
                            message: related.message,
                            relatedNodes: await Promise.all(related.relatedNodes.map(async (relatedNodes) => {
                                const target = relatedNodes.target.toString();
                                const element = await page.$(target)
                                const canBeHovered = await canHover(element, page)
                                let boundingBox = null
                                if (element) {
                                    try {

                                        boundingBox = await element.boundingBox()
                                        if (canBeHovered) {
                                            await element.hover();

                                            const screenshot = await page.screenshot({
                                                clip: {
                                                    x: boundingBox.x, // add a small margin to the left and right
                                                    y: boundingBox.y, // add a small margin to the top and bottom
                                                    width: boundingBox.width + 20,
                                                    height: boundingBox.height + 20,
                                                },
                                                omitBackground: true, // remove the background

                                            });
                                            writeFileSync(join(path, target + '.png'), screenshot);
                                        }
                                        else {


                                            const screenshot = await page.screenshot({
                                                clip: {
                                                    x: boundingBox.x, // add a small margin to the left and right
                                                    y: boundingBox.y, // add a small margin to the top and bottom
                                                    width: boundingBox.width + 20,
                                                    height: boundingBox.height + 20,
                                                },
                                                omitBackground: true, // remove the background

                                            });
                                            writeFileSync(join(path, target + '.png'), screenshot);

                                        }

                                    } catch (error) {
                                        //wll be added later !important
                                    }
                                }
                                else {
                                    boundingBox = null
                                }

                                return {
                                    html: relatedNodes.html,
                                    boundingBox
                                };
                            }))
                        };
                    })),
                };
            }
            return null;
        }));

        return {
            impact: violation.impact,
            title: violation.help,
            description: violation.description,
            issue: issue.filter((item) => item !== null)
        };
    }));

    return results;
}
