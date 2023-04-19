const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const { createCanvas, loadImage } = require('canvas');

const port = 3000;

// Define the endpoint to test image accessibility
app.get('/check-accessibility', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.goto(url, { waitUntil: 'networkidle0' });


    const screenshot = await page.screenshot({ fullPage: true });
    const canvas = await createCanvasFromScreenshot(screenshot);
    const images = await page.$$('img');

    const valid = []
    const errors = [];


    for (const image of images) {
        const alt = await image.evaluate((el) => el.alt);
        const src = await image.evaluate((el) => el.src);
        const style = await image.evaluate((el) => el.style);
        const caption = await image.evaluate((el) => el.caption);
        const role = await image.evaluate((el) => el.role);
        const tabindex = await image.evaluate((el) => el.tabindex);

        // Check alt attribute
        let isAccessible = true;
        if (!alt || alt.trim() === '') {

            const boundingBox = await image.boundingBox();
            if (boundingBox) {

                drawRectangleOnCanvas(canvas, boundingBox);
            }
            isAccessible = false;
            errors.push({
                src,
                alt: 'Missing alt attribute',
                style,
                caption,
                role,
                tabindex,
            });
        } else if (alt.length < 10) {

            const boundingBox = await image.boundingBox();
            if (boundingBox) {

                drawRectangleOnCanvas(canvas, boundingBox);
            }
            isAccessible = false;
            errors.push({
                src,
                alt: 'Alt attribute is not descriptive enough',
                style,
                caption,
                role,
                tabindex,
            });
        }

        // Check color contrast
        const colorContrast = await checkColorContrast(image, page);
        if (colorContrast < 4.5) {

            const boundingBox = await image.boundingBox();
            if (boundingBox) {

                drawRectangleOnCanvas(canvas, boundingBox);
            }
            isAccessible = false;
            errors.push({
                src,
                alt: 'Low color contrast',
                style,
                caption,
                role,
                tabindex,
            });
        }

        // Check if the image is decorative
        const isDecorative = await image.evaluate(
            (el) =>
                el.getAttribute('aria-hidden') === 'true' ||
                el.getAttribute('role') === 'presentation' ||
                el.getAttribute('tabindex') === '-1'
        );
        if (isDecorative) {
            const boundingBox = await image.boundingBox();
            if (boundingBox) {

                drawRectangleOnCanvas(canvas, boundingBox);
            }
            errors.push({
                src,
                alt: 'Decorative image',
                style,
                caption,
                role,
                tabindex,
            });
        }

        if (isAccessible) {
            valid.push({
                src,
                alt,
                style,
                caption,
                role,
                tabindex,
            });
        }

    }


    await browser.close();

    const modifiedScreenshot = canvas.toDataURL();
    require('fs').writeFileSync('screenshot.png', modifiedScreenshot.replace(/^data:image\/png;base64,/, ''), 'base64');

    res.json({ valid, errors });
});

async function checkColorContrast(page, element) {
    const bg = await page.evaluate(el => getComputedStyle(el).backgroundColor, element);
    const fg = await page.evaluate(el => getComputedStyle(el).color, element);
    const bgColors = bg.match(/\d+/g).map(Number);
    const fgColors = fg.match(/\d+/g).map(Number);

    const bgLuminance = calculateLuminance(bgColors[0], bgColors[1], bgColors[2]);
    const fgLuminance = calculateLuminance(fgColors[0], fgColors[1], fgColors[2]);
    const contrastRatio = (fgLuminance + 0.05) / (bgLuminance + 0.05);
    return contrastRatio;
}

function calculateLuminance(r, g, b) {
    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;

    const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4;
    const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4;
    const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4;

    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


