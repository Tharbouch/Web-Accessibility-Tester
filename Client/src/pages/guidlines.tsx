const Guidlines = () => {
    return (
        <section className="guidlines-section">
            <div className="content-container">
                <h2>What is Web Accessibility?</h2>
                <p>Web accessibility refers to the inclusive practice of designing and developing websites and web applications that can be used by everyone, regardless of their abilities or disabilities. </p>
                <p>It aims to ensure that people with disabilities can perceive, understand, navigate, and interact with the web effectively.</p>
            </div>

            <div className="content-container gray">
                <h2>Web Content Accessibility Guidelines (WCAG)</h2>
                <img src="/images/disabled-people-enjoying-the-internet.webp" alt="disabled people enjoying the internet" />
                <p>The Web Content Accessibility Guidelines (WCAG) are a set of guidelines published by the World Wide Web Consortium (W3C) to provide recommendations for creating accessible web content.</p>
                <p> The guidelines are organized into three levels of conformance: A, AA, and AAA. Let's explore some key guidelines:</p>
                <div className="list-wrapper">
                    <ol>
                        <li>
                            <h3>Perceivable</h3>
                            <ul>
                                <li>Provide text alternatives for non-text content, such as images, videos, and audio.</li>
                                <li>Ensure that all content is presented in a way that can be perceived by different senses, such as providing captions for videos.</li>
                                <li>Make sure the content can be displayed in different ways without losing its meaning or structure.</li>
                                <li>Provide sufficient color contrast between text and background.</li>
                            </ul>
                        </li>
                        <li>
                            <h3>Operable</h3>
                            <ul>
                                <li>Make all functionality available from a keyboard.</li>
                                <li>Provide users enough time to read and use content.</li>
                                <li>Do not use content that flashes or blinks excessively.</li>
                                <li>Ensure that users can easily navigate and find content.</li>
                            </ul>
                        </li>
                        <li>
                            <h3>Understandable</h3>
                            <ul>
                                <li>Make text content readable and understandable.</li>
                                <li>Use clear and consistent navigation throughout the website.</li>
                                <li>Provide instructions and feedback to assist users in completing tasks.</li>
                                <li>Ensure that form elements have labels or instructions.</li>
                            </ul>
                        </li>
                        <li>
                            <h3>Robust</h3>
                            <ul>
                                <li>Maximize compatibility with current and future user agents, including assistive technologies.</li>
                                <li>Use valid and well-structured markup.</li>
                                <li>Provide metadata to help users understand content and its relationships.</li>
                                <li>Ensure that content is accessible even when technologies like JavaScript are disabled.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="content-container ">
                <h2>Section 508</h2>
                <img src="/images/section-508-logo.webp" alt="section508 logo" />
                <p>Section 508 is a US federal law that requires federal agencies to make their electronic and information technology accessible to people with disabilities. </p>
                <p>Here are some key requirements of Section 508:</p>

                <div>
                    <ul>
                        <li>Ensure that all functionality is accessible via a keyboard interface.</li>
                        <li>Provide alternatives for multimedia content, such as captions for videos and transcripts for audio.</li>
                        <li>Ensure that all forms are accessible, including proper labeling and instructions for form fields.</li>
                        <li>Make sure that all visual content, including images, has text alternatives.</li>
                        <li>Ensure that web pages do not rely solely on color to convey information.</li>
                        <li>Provide clear and consistent navigation throughout the website.</li>
                        <li>Ensure that websites are compatible with assistive technologies, such as screen readers and braille displays.</li>
                    </ul>
                </div>
            </div>


            <div className=" content-container highlight gray">
                <p><strong>Note:</strong> Both WCAG and Section 508 provide guidelines to ensure web accessibility. Complying with these guidelines helps create a more inclusive web experience for all users.</p>
                <h2>Conclusion</h2>
                <p>By adhering to the Web Content Accessibility Guidelines (WCAG) and Section 508 requirements, you can create a more inclusive and accessible web experience. Implementing these guidelines ensures that people with disabilities can access and interact with your content effectively. Remember, web accessibility benefits all users, not just those with disabilities.</p>

            </div>


        </section>

    )
}

export default Guidlines;