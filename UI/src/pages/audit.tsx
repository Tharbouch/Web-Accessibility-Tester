import { useEffect, useState } from 'react'
import { FaTimesCircle, FaCheckCircle, FaFileDownload } from "react-icons/fa";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SyncLoader } from 'react-spinners'
import axios from 'axios';
import ReultsDetails from '../components/resultsDetails'

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
        score: 0,
        image: ''
    })
    const [violationsPercentage, setViolationsPercentage] = useState(0)
    const [passedPercentage, setPassedPercentage] = useState(0)
    const [error, setError] = useState<string>('')

    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation();

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
                url: location.state.url,
                standard: location.state.standard
            }

        }).then((res) => {
            setReport(prevState => ({
                ...prevState,
                violationsNumber: res.data.failedSize,
                passedNumber: res.data.passedSize,
                violations: res.data.failed,
                passed: res.data.passed,
                score: res.data.score,
                image: res.data.image
            }))

            const total = res.data.failedSize + res.data.passedSize
            const violationsPercentage = Math.round((res.data.failedSize / total) * 100);
            const passedPercentage = Math.round((res.data.passedSize / total) * 100);

            setViolationsPercentage(violationsPercentage);
            setPassedPercentage(passedPercentage);
            setIsLoading(false)

            const cacheData = {
                violationsNumber: res.data.failedSize,
                passedNumber: res.data.passedSize,
                violations: res.data.failed,
                passed: res.data.passed,
                violationsPercentage: violationsPercentage,
                passedPercentage: passedPercentage,
            };
            localStorage.setItem('auditCache', JSON.stringify(cacheData));
        }).catch((err) => {
            setError(err.response.data.message || err)
        })
    }


    useEffect(() => {
        if (location.state === null) {
            navigate('/')
        }
        if (location.state.newTest) {
            handleRequest();
            location.state.newTest = false
        }
        else {
            const cachedData = localStorage.getItem('auditCache');
            if (cachedData) {
                const cache = JSON.parse(cachedData);
                setReport(prevState => ({
                    ...prevState,
                    violationsNumber: cache.violationsNumber,
                    passedNumber: cache.passedNumber,
                    violations: cache.violations,
                    passed: cache.passed,
                    score: 0,
                    image: cache.image
                }));
                setViolationsPercentage(cache.violationsPercentage);
                setPassedPercentage(cache.passedPercentage);
                setIsLoading(false);
                console.log("hi cache")
            }
            else {
                console.log("hi no cache")
                handleRequest()
            }
        }

    }, [])

    return (

        <section className='section-audit'>
            {
                isLoading
                    ?
                    <div className='loading-container'>
                        {
                            error !== '' &&
                            <>
                                <h2>{error}</h2>
                                <Link to="/">go to Homepage</Link>
                            </>
                        }
                        <div className='image-wrapper'>
                            <img src="/images/testing.jpg" alt="loading illustration" />
                        </div>
                        <div className='description-wrapper'>
                            <h3>Scanning your page</h3>
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
                                        Analyze result for: <br />{location.state.url}
                                    </h2>
                                </div>
                                <div className='image-container'>
                                    <img src={`data:image/png;base64,${report.image}`} alt="website screenshot" />
                                </div>
                            </div>
                            <div className='right'>
                                <div className='results-summary'>
                                    <div className='result-wrapper'>
                                        <div className='title-container'>
                                            <h2>Status:</h2>
                                        </div>
                                        <span></span>
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
                                        <span></span>
                                        <div className='progress-wrapper'>
                                            <div className={report.score > 50 ? 'progress-circle over50' : 'progress-circle'}>
                                                <span>{report.score}%</span>
                                                <div className="left-half-clipper">
                                                    <div className="first50-bar" style={{ backgroundColor: report.score < 50 ? '#fa2929' : report.score < 90 ? '#fab129' : '#4ec708' }}></div>
                                                    <div className="value-bar" style={{
                                                        transform: `rotate(${Math.round(report.score * 360 / 100)}deg)`,
                                                        border: report.score < 50 ? '10.8px solid #fa2929' : report.score < 90 ? '10.8px solid #fab129' : '10.8px solid #4ec708'
                                                    }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='note-container'>
                                            <p>Websites with a score lower than 90% are at risk of accessibility lawsuits</p>
                                        </div>
                                    </div>
                                    <div className='result-wrapper'>
                                        <div className="title-container">
                                            <h2>Results:</h2>
                                        </div>
                                        <span></span>
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
                                <ReultsDetails violationsReport={report.violations} failedNumber={report.violationsNumber} />
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