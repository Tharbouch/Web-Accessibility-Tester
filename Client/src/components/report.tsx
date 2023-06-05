import { FaLowVision, FaChevronDown, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';;
import React from 'react';

interface ReportType {
    violationsNumber: number;
    passedNumber: number;
    violations: {
        title: string;
        impact: string;
        description: string;
        issues: {
            target: string;
            toBeFixed: {
                message: string;
                relatedNodes: {
                    target: string;
                }[];
            }[];
        }[];
    }[];
    passed: any[];
    score: number;
    image: string;
}


const Report = (report: ReportType) => {


    return (
        <div className="results-details">
            <>
                {report.violations.map((violation, index) => {
                    return (
                        <div className="results-container" key={index}>
                            <div className="result-id-bar">
                                <div className="details-title">
                                    <FaLowVision />
                                    <h3>{violation.title}</h3>
                                </div>
                                <div className="status-container">
                                    <span className={`${violation.impact}`}>{violation.impact}</span>
                                    <FaChevronDown />
                                </div>
                            </div>
                            <AnimatePresence>
                                <motion.div
                                    className="results-details-wrapper expanded"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{violation.description}</p>
                                    <div className="details-description">
                                        <div className="main-elements">
                                            <div className="swiper-header">
                                                <h4>failed elements</h4>
                                                <div className="swiper-nav-btns">
                                                    <FaAngleLeft />
                                                    <FaAngleRight />
                                                </div>
                                            </div>
                                            {violation.issues.map((issue, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <span>{issue.target}</span> <br />
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    );
                })}
            </>
        </div>
    );
};

export default Report;