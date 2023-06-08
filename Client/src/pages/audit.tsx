import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { SyncLoader } from 'react-spinners'
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReultsDetails from '../components/resultsDetails'
import ResultSummary from '../components/resultSummary';
import { FaFileDownload } from 'react-icons/fa';
import { AuthContext, AuthContextType } from '../context/authContext';

interface ReportType {
    violationsNumber: number;
    passedNumber: number;
    violations: {
        title: string;
        impact: string;
        disabilitiesAffected:string[]
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


    const authContext = useContext<AuthContextType | null>(AuthContext)
    const { authState } = authContext as AuthContextType;
    const [report, setReport] = useState<ReportType>({
        violationsNumber: 0,
        passedNumber: 0,
        violations: [{
            title: '',
            impact: '',
            disabilitiesAffected:[],
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


    const handelRescan = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsLoading(true)
        await handleRequest(true)
    }

    const handleRequest = async (newTest: boolean) => {
        const report = location.state.report
        if (!newTest) {
            setReport(prevState => ({
                ...prevState,
                violationsNumber: report.audit.failedSize,
                passedNumber: report.audit.passedSize,
                violations: report.audit.failed,
                passed: report.audit.passed,
                score: report.audit.score,
                image: report.audit.image
            }))
            const total = report.audit.failedSize + report.audit.passedSize
            const violationsPercentage = Math.round((report.audit.failedSize / total) * 100);
            const passedPercentage = Math.round((report.audit.passedSize / total) * 100);

            setViolationsPercentage(violationsPercentage);
            setPassedPercentage(passedPercentage);
            setIsLoading(false)
        }
        else {
            axios({
                url: 'http://localhost:4000/api/v1/check-accessibility',
                method: 'post',
                data: {
                    url: location.state.url,
                    standard: location.state.standard,
                    userID: authState.user?.userID !== null ? authState.user?.userID : '',
                    reportID: location.state.reportID !== null ? location.state.reportID : ''
                },
                withCredentials: true

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

            }).catch((err) => {
                setError(err.response.data.message || err)
            })
        }
    }

    useEffect(() => {
        if (location.state === null) {
            navigate('/')
        }
        else {
            const report = location.state.report
            if (report) {
                handleRequest(false);
            }
            else {
                handleRequest(true);
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
                                    <button className='download-btn' ><FaFileDownload /> Download Report</button>
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

