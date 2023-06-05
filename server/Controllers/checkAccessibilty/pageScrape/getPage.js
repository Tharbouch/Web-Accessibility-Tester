const puppeteer = require('puppeteer');

module.exports.getPage = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        await page.setBypassCSP(true);
        await page.goto(url, { waitUntil: 'networkidle0' });

        const image = await page.screenshot()
       
        return [browser,page, image];
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
}