import React, { useState } from 'react'
import { FaLowVision, FaTimesCircle, FaChevronDown } from "react-icons/fa";
import '../assets/audit.css'
import { AnimatePresence, motion } from 'framer-motion';
export default function Audit() {
    const [violationsPercentage, setViolationsPercentage] = useState(30)
    const [passedPercentage, setPassedPercentage] = useState(70)
    const [score, setScore] = useState(95)

    const [display, setDisplay] = useState(new Array(5).fill(false))


    const dispalyResults = (index: any) => {

        const temp = [...display]
        temp[index] = !temp[index]
        setDisplay(temp)
    }

    return (
        <section className='section-audit'>
            <div className='left'>
                <div className='title-wrapper'>
                    <h2>
                        Analyze result for: www.uca.ma/este
                    </h2>
                </div>
                <div className='image-container'>
                    <img src="screen.png" alt="" />
                </div>
            </div>
            <div className='right'>
                <div className='results-summary'>
                    <div className='result-wrapper'>
                        <div className='title-container'>
                            <h2>Status:</h2>
                        </div>
                        <div className='details-wrapper'>
                            <div className='icon-container'>
                                <FaTimesCircle />
                            </div>
                            <div className='details-container'>
                                <h3>NOT COMPLIANT</h3>
                                <p>You are currently at risk of accessibility lawsuits</p>
                            </div>
                        </div>
                    </div>
                    <div className='result-wrapper'>
                        <div className="title-container">
                            <h2>Score:</h2>
                        </div>
                        <div className='progress-wrapper'>
                            <div className={score > 50 ? 'progress-circle over50' : 'progress-circle'}>
                                <span>10%</span>
                                <div className="left-half-clipper">
                                    <div className="first50-bar" style={{ backgroundColor: score < 50 ? '#fa2929' : score < 90 ? '#fab129' : '#4ec708' }}></div>
                                    <div className="value-bar" style={{
                                        transform: `rotate(${Math.round(score * 360 / 100)}deg)`,
                                        border: score < 50 ? '10.8px solid #fa2929' : score < 90 ? '10.8px solid #fab129' : '10.8px solid #4ec708'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='result-wrapper'>
                        <div className="title-container">
                            <h2>Results:</h2>
                        </div>

                        <div className="bars-wrapper">
                            <div className='bar-container'>
                                <div className="bar-description">
                                    <h3>Violations</h3>
                                    <span>7 items (30%)</span>
                                </div>
                                <div className="progressbar">
                                    <div style={{
                                        height: "100%",
                                        width: `${violationsPercentage}%`,
                                        backgroundColor: "#fa2929",
                                        transition: "width 0.5s"
                                    }}>
                                    </div>
                                </div>
                            </div>
                            <div className="bar-container">
                                <div className="bar-description">
                                    <h3>Passed</h3>
                                    <span>26 items (70%)</span>
                                </div>
                                <div className="progressbar">
                                    <div style={{
                                        height: "100%",
                                        width: `${passedPercentage}%`,
                                        backgroundColor: "#4ec708",
                                        transition: "width 0.5s"
                                    }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="results-details">
                    <div className='results-container'>
                        <div className='result-id-bar' onClick={() => { dispalyResults(0) }}>
                            <div className='details-title'>
                                <FaLowVision />
                                <p>visual disability</p>
                                <h3>ARIA input fields must have an accessible name</h3>
                            </div>
                            <div className='status-container'>
                                <span>serious</span>
                                <FaChevronDown />
                            </div>
                        </div>
                        <AnimatePresence>
                            {display[0] && (
                                <motion.div
                                    className={`results-details-wrapper ${display[0] ? 'expanded' : ''}`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>Ensures every ARIA input field has an accessible name</p>
                                    <div className='details-description'>
                                        <div className='main-elements'>
                                            <h4>Failed Elements</h4>
                                            <ul>
                                                <li>{`<div class=\"carousel-inner\" role=\"listbox\">`}</li>
                                                <li>{`<div class=\"carousel-inner\" role=\"listbox\">`}</li>
                                            </ul>
                                        </div>
                                        <div className='to-fix'>
                                            <p>To fix this, solve one of the following:</p>
                                            <ul>
                                                <li>
                                                    Element does not have inner text that is visible to screen readers
                                                </li>
                                                <li>
                                                    aria-label attribute does not exist or is empty
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section >
    );
}
