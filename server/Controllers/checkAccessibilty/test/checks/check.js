const axe = require('axe-core');
const types = require('../issuesTypes/types');

async function getDisabilitiesAffected(id) {
    // Check which Disabilities are Affected by the issue
    const DisabilitiesAffected = []
    for (const key in types) {
        if (types.hasOwnProperty(key)) {
            const items = types[key];
            if (items.includes(id)) {
                DisabilitiesAffected.push(key)
            }
        }
    }
    return DisabilitiesAffected
}

module.exports.checkAccessibility = async (page, url, standard) => {
    // Set up check configuration
    const accessibilityOptions = {
        runOnly: standard === "WCAG" ? ['cat.*', 'wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'best-practice'] : ['cat.*', 'section508', 'section508.*.*']
    };

    // Inject axe-core into the page
    await page.addScriptTag({ path: require.resolve('axe-core') });

    // Launch the check
    const accessibilityResults = await page.evaluate(async (options) => {
        return await axe.run(options);
    }, accessibilityOptions);

    const failed = await Promise.all(accessibilityResults.violations.map(async (violation) => {
        const disabilitiesAffected = await getDisabilitiesAffected(violation.id);
        const issues = await Promise.all(violation.nodes.map(async (node) => {
            if (node.target) {
                return {
                    target: node.html,
                    toBeFixed: await Promise.all(node.any.map(async (related) => {
                        return {
                            message: related.message,
                            relatedNodes: related.relatedNodes.length > 0 ? await Promise.all(related.relatedNodes.map(async (relatedNodes) => {
                                return {
                                    target: relatedNodes.html,
                                };
                            })) : []
                        };
                    })),
                };
            }
            return null;
        }));

        return {
            impact: violation.impact,
            title: violation.help,
            id: violation.id,
            disabilitiesAffected: disabilitiesAffected,
            description: violation.description,
            issues: issues.filter((item) => item !== null)
        };
    }));

    const passed = await Promise.all(accessibilityResults.passes.map(async (passed) => {
        return {
            check: "[" + passed.id + "] " + passed.description,
            disabilitiesAffected: await getDisabilitiesAffected(passed.id),
            description: passed.help
        }
    }));

    const score = await calculateAccessibilityScore(failed);
    const failedSize = failed.length;
    const passedSize = passed.length;

    return [failed, passed, failedSize, passedSize, score];
};

const weights = {
    critical: 0.35,
    serious: 0.30,
    moderate: 0.20,
    minor: 0.15,
};

const calculateAccessibilityScore = async (failed) => {
    const totalViolation = failed.length;
    if (totalViolation === 0) {
        return 100;
    }

    const criteriaScores = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0,
    };

    failed.forEach((violation) => {
        criteriaScores[violation.impact] += 1;
    });

    let weightedSum = 0;
    Object.keys(weights).forEach((criterion) => {
        weightedSum += (criteriaScores[criterion] / totalViolation) * weights[criterion];
    });

    const accessibilityScore = (1 - weightedSum) * 100;
    return Math.round(accessibilityScore);
};
