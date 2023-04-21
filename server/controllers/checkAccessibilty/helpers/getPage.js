const puppeteer = require('puppeteer');

module.exports.getPage = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        await page.setBypassCSP(true);
        await page.goto(url, { waitUntil: 'networkidle0' });


        return page;

    } catch (error) {
        if (
            error.message.includes('ERR_NAME_NOT_RESOLVED') ||
            error.message.includes('ERR_CONNECTION_REFUSED') ||
            error.message.includes('ERR_TIMED_OUT')
        ) {
            res.status(404).json({ error: 'Failed to load the website.' });
        }
    }

}