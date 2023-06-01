import { useState } from "react"
import { FaLowVision, FaChevronDown, FaAngleRight, FaAngleLeft } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide, } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

interface ViolationsType {
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
                                <FaLowVision />
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
                                                return <><span key={index}>{issue.target}</span> <br /></>
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