import { useEffect, useState } from 'react'
import { FaLowVision, FaTimesCircle, FaChevronDown, FaCheckCircle, FaFileDownload } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { SyncLoader } from 'react-spinners'
import axios from 'axios';

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
}

interface IssuesType {
    target: string;
    toBeFixed: {
        message: string;
        relatedNodes: {
            target: string;
        }[];
    }[];
}


export default function Audit() {

    const [report, setReport] = useState<ReportType>({
        violationsNumber: 0,
        passedNumber: 0,
        violations: [{
            title: '',
            impact: '',
            description: '',
            issues: [
                {
                    target: '',
                    toBeFixed: [{
                        message: '',
                        relatedNodes: [{
                            target: ''
                        }]
                    }]
                }
            ]
        }],
        passed: [{}],
        score: 0
    })
    const [violationsPercentage, setViolationsPercentage] = useState(0)
    const [passedPercentage, setPassedPercentage] = useState(0)
    const [display, setDisplay] = useState<Array<boolean | null>>([])
    const [score, setScore] = useState(50)

    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation();

    const dispalyResults = (index: number) => {

        const temp = [...display]
        temp[index] = !temp[index]
        setDisplay(temp)
    }

    const handelRescan = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsLoading(true)
        handleRequest()
    }

    const handleRequest = () => {
        axios({
            url: 'http://localhost:4000/api/v1/check-accessibility',
            method: 'post',
            data: {
                url: location.state.url
            }

        }).then((res) => {
            setReport(prevState => ({
                ...prevState,
                violationsNumber: res.data.failedSize,
                passedNumber: res.data.passedSize,
                violations: res.data.failed,
                passed: res.data.passed
            }))

            const total = res.data.failedSize + res.data.passedSize
            const violationsPercentage = Math.round((res.data.failedSize / total) * 100);
            const passedPercentage = Math.round((res.data.passedSize / total) * 100);


            setViolationsPercentage(violationsPercentage);
            setPassedPercentage(passedPercentage);
            setDisplay(new Array(res.data.failedSize).fill(false))
            setIsLoading(false)
        }).catch((err) => {
            console.warn(err)
        })
    }


    useEffect(() => {
        if (location.state === null) {
            navigate('/')
        }
        else {
            handleRequest();
        }

    }, [])

    return (

        <section className='section-audit'>
            {
                isLoading
                    ?
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className='image-wrapper'>
                            <img src="/images/testing.jpg" alt="" />
                        </div>
                        <div className='description-wrapper'>
                            <h2>Scanning your page</h2>
                            <SyncLoader color="#134e9d" />
                        </div>
                    </div>
                    :

                    <>
                        <div className='tools-container'>
                            <div className='tools-wrapper'>
                                <div className='rescan-btn-wrap'>
                                    <button className='rescan-btn'><FaFileDownload /> Download Report</button>
                                </div>
                                <div className='rescan-btn-wrap'>
                                    <button className='rescan-btn' onClick={(e) => { handelRescan(e) }}>Rescan</button>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className='left'>
                                <div className='title-wrapper'>
                                    <h2>
                                        Analyze result for: {location.state.url}
                                    </h2>
                                </div>
                                <div className='image-container'>
                                    <img src="/images/screen.png" alt="" />
                                </div>
                            </div>
                            <div className='right'>
                                <div className='results-summary'>
                                    <div className='result-wrapper'>
                                        <div className='title-container'>
                                            <h2>Status:</h2>
                                        </div>
                                        <div className='details-wrapper'>

                                            {
                                                report.violationsNumber === 0
                                                    ?
                                                    <>
                                                        <div className='icon-container'>
                                                            <FaCheckCircle style={{ color: '#4ec708' }} />
                                                        </div>
                                                        <div className='details-container'>
                                                            <h3>COMPLIANT</h3>
                                                            <p>You are currently not at risk of accessibility lawsuits.</p>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className='icon-container'>
                                                            <FaTimesCircle style={{ color: '#dd2626' }} />
                                                        </div>
                                                        <div className='details-container'>
                                                            <h3>NOT COMPLIANT</h3>
                                                            <p>You are currently at risk of accessibility lawsuits</p>
                                                        </div>
                                                    </>
                                            }
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
                                                    <span>{report.violationsNumber} items ({violationsPercentage}%)</span>
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
                                                    <span>{report.passedNumber} items ({passedPercentage}%)</span>
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
                                    <> {report.violations.map((violation, index) => {
                                        return (
                                            <div className='results-container' key={index}>
                                                <div className='result-id-bar' onClick={() => { dispalyResults(index) }}>
                                                    <div className='details-title'>
                                                        <FaLowVision />
                                                        <h3>{violation.title}</h3>
                                                    </div>
                                                    <div className='status-container'>
                                                        <span>{violation.impact}</span>
                                                        <FaChevronDown />
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {display[index] && (
                                                        <motion.div
                                                            className={`results-details-wrapper ${display[index] ? 'expanded' : ''}`}
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <p>{violation.description}</p>
                                                            <div className='details-description'>
                                                                <div className='main-elements'>
                                                                    <h4>Failed Elements</h4>
                                                                    <ul>
                                                                        <>
                                                                            {
                                                                                violation.issues.map((issue, index) => {
                                                                                    return console.log(issue)
                                                                                })
                                                                            }
                                                                        </>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>)
                                    })}</>
                                </div>
                            </div>
                        </div>

                    </>

            }
        </section >

    );
}


/*
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
                                                                    </div>*/