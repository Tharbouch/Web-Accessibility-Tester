import { useState } from "react"
import { FaLowVision, FaChevronDown, FaAngleRight, FaAngleLeft } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion';
import ArrayCheckComponent from "./disabilityIcons";

interface ViolationsType {
    title: string;
    impact: string;
    disabilitiesAffected: string[];
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
}

interface ResultsDetailsProps {
    violationsReport: ViolationsType[];
    failedNumber: number;
}


const ReultsDetails = ({ violationsReport, failedNumber }: ResultsDetailsProps) => {
    const [display, setDisplay] = useState<Array<boolean | null>>(new Array(failedNumber).fill(false))

    const dispalyResults = (index: number) => {

        const temp = [...display]
        temp[index] = !temp[index]
        setDisplay(temp)
    }
    return (
        <div className="results-details">
            <> {violationsReport.map((violation, index) => {
                return (
                    <div className='results-container' key={index}>
                        <div className='result-id-bar' onClick={() => { dispalyResults(index) }}>
                            <div className='details-title'>
                                <ArrayCheckComponent values={violation.disabilitiesAffected} />
                                <span>|</span>
                                <h3>{violation.title}</h3>
                            </div>
                            <div className='status-container' >
                                <span className={`${violation.impact}`}>{violation.impact}</span>
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
                                        <div className="main-elements">
                                            <div className="swiper-header">
                                                <h4>failed elements</h4>
                                                <div className="swiper-nav-btns">
                                                    <FaAngleLeft />
                                                    <FaAngleRight />
                                                </div>
                                            </div>
                                            {violation.issues.map((issue, index) => {
                                                return <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }} key={index}>
                                                    <span >{issue.target}</span>
                                                    {
                                                        issue.toBeFixed.length !== 0 &&
                                                        <>
                                                            <b>Try to check this solutions:</b><div>
                                                                {issue.toBeFixed.map((tobefixed, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <ul>
                                                                                <li>{tobefixed.message}</li>
                                                                            </ul>
                                                                            <>{tobefixed.relatedNodes.length !== 0 &&
                                                                                <>
                                                                                    <h5>Realated nodes</h5>
                                                                                    <ul>
                                                                                        {tobefixed.relatedNodes.map((node, index) => {
                                                                                            return <li key={index}>{node.target}</li>;
                                                                                        })}
                                                                                    </ul>
                                                                                </>}</>

                                                                        </div>);
                                                                })}
                                                            </div>
                                                        </>
                                                    }
                                                    <br />
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>)
            })}</>
        </div >
    );
}

export default ReultsDetails;