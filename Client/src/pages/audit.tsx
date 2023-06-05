import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SyncLoader } from 'react-spinners'
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReultsDetails from '../components/resultsDetails'
import ResultSummary from '../components/resultSummary';
import { FaFileDownload } from 'react-icons/fa';

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

    const generatePDF = () => {
        const element = document.getElementById('audit-section'); // Use the ID of the root element containing ResultSummary and ReultsDetails
        if (element) {
          const opt = {
            filename: 'report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          };
    
          html2pdf().set(opt).from(element).save();
        }
      };

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
                                <div className='download-btn-wrap'>
                                    <button className='download-btn' onClick={generatePDF}><FaFileDownload /> Download Report</button>
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
                                <ResultSummary report={report} violationsPercentage={violationsPercentage} passedPercentage={passedPercentage} />
                                <ReultsDetails violationsReport={report.violations} failedNumber={report.violationsNumber} />
                            </div>
                        </div>

                    </>

            }
        </section >
        

    );
}

