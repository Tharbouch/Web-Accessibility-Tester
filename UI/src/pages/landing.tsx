import { FaQuestionCircle, FaPager } from 'react-icons/fa'
import { TbReportAnalytics, TbZoomCheck } from "react-icons/tb";
import '../assets/landing.css'

const Landing = () => {
    return (
        <>
            <section className='home-section'>
                <div className="home-container">
                    <div className="home-image">
                        <img src="/login.png" alt="illustration of people that have accessibility disabilities" />
                    </div>
                    <div className="tool-description">
                        <h1 className="title">
                            Find out if your website is Accessible and Compliant
                        </h1>
                        <p>
                            Our checker identifies web accessibility issues and gives exact instructions for fixing them.
                        </p>
                        <div className="start-button">
                            <button className="get-started-button" type="submit">
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