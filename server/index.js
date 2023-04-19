const { default: AxePuppeteer } = require('@axe-core/puppeteer');
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {
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

    try {
        await page.goto(url, { waitUntil: 'networkidle0' });

        const accessibilityOptions = {
            xpath: true,
            absolutePaths: true,
            reporter: 'v2'
        };

        const accessibilityResults = await new AxePuppeteer(page)
            .options(accessibilityOptions)
            .analyze();

        const violations = await getIssues(accessibilityResults)

        res.json(violations);


    } catch (error) {
        if (
            error.message.includes('ERR_NAME_NOT_RESOLVED') ||
            error.message.includes('ERR_CONNECTION_REFUSED') ||
            error.message.includes('ERR_TIMED_OUT')
        ) {
            res.status(404).json({ error: 'Failed to load the website.' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    } finally {
        await browser.close();
    }
});

app.listen(3333, () => {
    console.log('Server is running on port 3333');
});

async function getIssues(accessibilityResults) {
    const results = accessibilityResults.violations.map((violation) => {
        const issue = violation.nodes.map((node) => ({
            target: node.target,
            toBeFixed: node.any.map((related) => {
                return {
                    message: related.message,
                    relatedNodes: related.relatedNodes.length > 0 ? related.relatedNodes.map((relatedNodes) => {
                        return relatedNodes.html
                    }) : null
                }
            })

        }));

        return {
            impact: violation.impact,
            title: violation.help,
            description: violation.description,
            issue
        };
    });
    return results;
}


async function HighlightElement(params) {

}