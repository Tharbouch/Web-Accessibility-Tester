const EventEmitter = require('events');
const { checkAccessibility } = require('./checks/check');
const { getPage } = require('./pageScrape/getPage');
const Audit = require('../../../Models/audit')
const accessibilityEmitter = new EventEmitter();
const testCounts = new Map();

async function accessibilityCheck(req, res, next) {
    const { url, standard, userID } = req.body;
    console.log(userID)

    try {
        if (!req.cookies.user) {//Verify user authentication status.

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

                const response = await runTest(url, standard, next);
                res.json(response);
                // Emit an event to indicate the response has been sent
                accessibilityEmitter.emit('responseSent');
            } else {
                res.status(401);
                next({ message: 'Maximum number of tests reached for the next 24 hours. Please login or try again later.' });
            }
        } else {
            const response = await runTest(url, standard, next);

            // Save the data to the database
            await saveDataToDatabase(url, userID, response);
            console.log('done')

            res.json(response);
            // Emit an event to indicate the response has been sent
            accessibilityEmitter.emit('responseSent');


        }
    } catch (error) {
        if (
            error.message.includes('ERR_NAME_NOT_RESOLVED') ||
            error.message.includes('ERR_CONNECTION_REFUSED') ||
            error.message.includes('ERR_TIMED_OUT') ||
            error.message.includes('ERR_NAME_NOT_RESOLVED')
        ) {
            res.status(404);
            next({ message: 'Failed to load the website' });
        } else if (error.message === 'URL is required') {
            res.status(400);
            next({ message: 'URL is required' });
        } else if (error.message === 'Standard is required') {
            res.status(400);
            next({ message: 'Standard is required' });
        } else {
            res.status(500)
            next(error);
        }
    }

}

async function runTest(url, standard) {
    // Verify the presence of the URL and the corresponding standard.
    if (!url) {
        throw new Error('URL is required');
    }
    if (!standard) {
        throw new Error('Standard is required');
    }

    const [browser, page, rawimage] = await getPage(url); // scrape the page
    const image = rawimage.toString('base64');// convert image binary data into a Base64 encoded string representatio

    const [failed, passed, failedSize, passedSize, score] = await checkAccessibility(page, url, standard); // run test

    await browser.close()
    return {
        failedSize,
        failed,
        passed,
        passedSize,
        score,
        image
    };

}

async function saveDataToDatabase(url, userID, data) {
    const date = new Date().toISOString().split('T')[0]
    // Save the data to the database
    Audit.create({ owner: userID, website: url, lastScan: date, audit: data })
        .then((response) => {
            console.log("report been save for the user " + userID + " for the website " + url)
        })
        .catch((err) => { console.log(err) })
}

// Event listener to close the event after response is sent
function closeEvent() {
    accessibilityEmitter.removeListener('responseSent', closeEvent);
    accessibilityEmitter.removeAllListeners();
}

accessibilityEmitter.on('responseSent', closeEvent);

module.exports = accessibilityCheck;
