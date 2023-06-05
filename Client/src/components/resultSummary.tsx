
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
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

interface propsType {
    report: ReportType;
    violationsPercentage: number;
    passedPercentage: number;
}
export default function ResultSummary({ report, violationsPercentage, passedPercentage }: propsType) {
    return (
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
    )
}
