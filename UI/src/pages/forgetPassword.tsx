import '../assets/forgetpassword.css'

export default function ForgetPassword() {
    return (
        <section >
            <div className='section-wrap'>
                <h2>Getting back into your account</h2>
                <p>Tell us some information about your account.</p>
                <div className='info-input'>
                    <label htmlFor="userinfo">Enter your email or phone number</label>
                    <input id="userinfo" type="text" autoComplete='off' name='userInfo' autoCorrect="off" autoCapitalize='off' />
                </div>
                <div className="button-wrap">
                    <button>Send My Password Reset Link</button>
                </div>
            </div>

        </section>
    )
}
