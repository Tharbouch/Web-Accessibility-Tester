const EventEmitter = require('events');
const { checkAccessibility } = require('./checks/check');
const { getPage } = require('./pageScrape/getPage');

const accessibilityEmitter = new EventEmitter();

async function accessibilityCheck(req, res, next) {
    const { url } = req.body;
    try {
        if (!url) {
            throw new Error('URL is required');
        }
        const page = await getPage(url);

        const [failed, passed, failedSize, passedSize] = await checkAccessibility(page, url);

        res.json({
            failedSize,
            failed,
            passed,
            passedSize
        });

        // Emit an event to indicate the response has been sent
        accessibilityEmitter.emit('responseSent');

    } catch (error) {
        if (error.message === 'Failed to load the website') {
            res.status(404);
            next({ message: 'Failed to load the website' });
        } else if (error.message === 'URL is required') {
            res.status(400);
            next({ message: 'URL is required' });
        } else {
            next(error);
        }
    }
}

// Event listener to close the event after response is sent
function closeEvent() {
    accessibilityEmitter.removeListener('responseSent', closeEvent);
    accessibilityEmitter.removeAllListeners();
}

accessibilityEmitter.on('responseSent', closeEvent);

module.exports = accessibilityCheck;
