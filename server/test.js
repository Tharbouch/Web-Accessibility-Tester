const express = require('express')
const http = require('http')
const app = express()
const puppeteer = require('puppeteer');
const server = http.createServer(app)

app.get('/', async (req, res) => {
    const { url } = req.query

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        })
        await page.goto(url);
        await page.screenshot({ path: 'screen.png' })
        await browser.close()
    } catch (error) {
        console.log(error);
    }
})
server.listen(process.env.PORT || 4000, () => {
    console.log(`server on `)
});