const puppeteer = require('puppeteer')
const express = require('express')
const { createCanvas, loadImage } = require('canvas');

const app = express()

app.get('/', async (req, res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });

    await page.goto("https://www.uca.ma/", { waitUntil: 'networkidle0' });

    //const screenshot = await page.screenshot({ fullPage: true });
    //const canvas = await createCanvasFromScreenshot(screenshot);

    const element = await page.$(".col-md-8.col-sm-6.col-xs-12 > .news > .info > .info-c > p")
    await element.hover();

    // add a class to the element to keep it in the hover state
    await page.evaluate((element) => {
        element.classList.add('hovered');
    }, element);

    // wait for the element to finish transitioning to the hover state
    await page.waitForFunction(
        (element) => window.getComputedStyle(element).getPropertyValue('background-color') === 'rgb(255, 0, 0)',
        {},
        element
    );

    // wait for a few more milliseconds to ensure that the hover state is fully applied
    await page.waitForTimeout(500);

    // take a screenshot of the element with the 'hovered' class
    const screenshot = await element.screenshot({
        encoding: 'base64',
    });

    // convert the base64-encoded screenshot to a PNG image and save it to disk
    require('fs').writeFileSync('screenshot.png', screenshot, 'base64');


    await browser.close()

    res.send('done')
})

app.listen(3000)

async function createCanvasFromScreenshot(screenshot) {
    const image = await loadImage(screenshot);
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return canvas;
}

async function drawRectangleOnCanvas(canvas, boundingBox) {
    const context = canvas.getContext('2d');
    context.strokeStyle = '#ff0000';
    context.lineWidth = 3;
    context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
}