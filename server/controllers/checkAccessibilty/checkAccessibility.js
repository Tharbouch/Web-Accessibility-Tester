const { checkAccessibility } = require('./helpers/check')
const { getPage } = require('./helpers/getPage')

async function accessibilityCheck(req, res) {

    const { url } = req.query

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const page = await getPage(url)

        const results = await checkAccessibility(page)

        res.json(results);
    } catch (error) {
        console.log(error);
    }
}

module.exports = accessibilityCheck;