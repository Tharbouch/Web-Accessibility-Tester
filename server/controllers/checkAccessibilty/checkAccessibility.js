const { checkAccessibility } = require('./helpers/check')
const { getPage } = require('./helpers/getPage')

async function accessibilityCheck(req, res) {

    const { url } = req.query

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const page = await getPage(url)

        const [failed, passed, failedSize, passedSize] = await checkAccessibility(page, url)

        res.json({
            failedSize,
            failed: failed,
            passed: passed,
            passedSize
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports = accessibilityCheck;