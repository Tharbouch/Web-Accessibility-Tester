import axios from "axios"
import { ChangeEvent, useState } from "react"

export default function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const handleClick = () => {
        axios({
            url: 'http://localhost:4000/api/v1/user/password-recovery',
            method: 'post',
            data: email
        }).then((response) => {
            console.log(response)
            setMessage(response.data.message)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <section >
            <div className='section-wrap'>
                {
                    message
                    &&
                    <div className="success-msg">
                        <p>{message}</p>
                    </div>
                }
                <h2>Getting back into your account</h2>
                <p>Tell us some information about your account.</p>
                <div className='info-input'>
                    <label htmlFor="userinfo">Enter your email or phone number</label>
                    <input id="userinfo" type="text" autoComplete='off' name='userInfo' autoCorrect="off" autoCapitalize='off' onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }} />
                </div>
                <div className="button-wrap">
                    <button onClick={handleClick}>Send My Password Reset Link</button>
                </div>
            </div>
        </section>
    )
}
