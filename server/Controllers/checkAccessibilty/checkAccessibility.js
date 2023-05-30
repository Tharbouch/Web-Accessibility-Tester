const EventEmitter = require('events');
const { checkAccessibility } = require('./checks/check');
const { getPage } = require('./pageScrape/getPage');

const accessibilityEmitter = new EventEmitter();
const testCounts = new Map();


async function accessibilityCheck(req, res, next) {
    const ip = req.ip;
    const currentTime = Date.now();

    let { count, timestamp } = testCounts.get(ip) || { count: 0, timestamp: currentTime };

    // Check if 24 hours have passed since the last test
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (currentTime - timestamp >= twentyFourHours) {
        // Reset the count and update the timestamp
        count = 0;
        timestamp = currentTime;
    }

    if (count < 5) {
        // Increment the test count for the IP address
        count++;
        testCounts.set(ip, { count, timestamp });


        const { url } = req.body;
        try {
            if (!url) {
                throw new Error('URL is required');
            }
            const page = await getPage(url);

            const [failed, passed, failedSize, passedSize, score] = await checkAccessibility(page, url);

            res.json({
                failedSize,
                failed,
                passed,
                passedSize,
                score
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
    } else {
        res.status(401).json({ message: 'Maximum number of tests reached for the next 24 hours. Please try again later.' });
    }
}

// Event listener to close the event after response is sent
function closeEvent() {
    accessibilityEmitter.removeListener('responseSent', closeEvent);
    accessibilityEmitter.removeAllListeners();
}

accessibilityEmitter.on('responseSent', closeEvent);

module.exports = accessibilityCheck;
