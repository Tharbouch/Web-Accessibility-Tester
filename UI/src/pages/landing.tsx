import { FaQuestionCircle, FaPager } from 'react-icons/fa'
import { TbReportAnalytics, TbZoomCheck } from "react-icons/tb";
import { useCallback, useState } from 'react';
import LunchTest from '../components/LaunchTest';

const Landing = () => {

    const [modalOpen, setModalOpen] = useState(false)

    const lockScroll = useCallback(() => {
        const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarCompensation}px`;
    }, [])

    const unlockScroll = useCallback(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = ''
    }, [])

    const close = () => {
        unlockScroll()
        setModalOpen(false)
    }

    const open = () => {
        lockScroll()
        setModalOpen(true)
    }


    return (
        <>
            {modalOpen && <LunchTest handleClose={close} />}
            <section className='home-section'>
                <div className="home-container">
                    <div className="home-image">
                        <img src="/images/disabledPeople.jpg" alt="illustration of people that have accessibility disabilities" />
                    </div>
                    <div className="tool-description">
                        <h1 className="title">
                            Find out if your website is Accessible and Compliant
                        </h1>
                        <p>
                            Our checker identifies web accessibility issues and gives exact instructions for fixing them.
                        </p>
                        <div className="start-button">
                            <button className="get-started-button" onClick={() => (modalOpen ? close() : open())}>
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="description-section">
                <div className="description-container">
                    <div className='left'>
                        <div className='item-top'>
                            <div className='item-icon-top'>
                                <FaQuestionCircle />
                            </div>
                            <div className="description-item-top">
                                <h2>How does it work?</h2>
                                <p>Our website accessibility checker does the hard work for you, scanning your website's code to identify accessibility deficiencies</p>
                            </div>
                        </div>

                        <div className='item'>
                            <div className='item-icon'>
                                <FaPager />
                            </div>
                            <div className="description-item">
                                <h3>Type your websit's URL</h3>
                                <p>Our system scans any live domain</p>
                            </div>
                        </div>
                        <div className='item'>
                            <div className='item-icon'>
                                <TbZoomCheck />
                            </div>
                            <div className="description-item">
                                <h3>Choose legislation </h3>
                                <p>Audit your website against major legislations around the world</p>
                            </div>
                        </div>

                        <div className='item'>
                            <div className='item-icon'>
                                <TbReportAnalytics />
                            </div>
                            <div className="description-item">
                                <h3>Get a detailed & accurate audit</h3>
                                <p>Including elaborate explanations and recommended solutions</p>
                            </div >
                        </div>
                    </div>
                    <div className='right'>

                    </div>

                </div>
            </section>
        </>
    );
}

export default Landing;