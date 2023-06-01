
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NewPassword() {

    const [checked1, setChecked1] = useState<boolean>(false)
    const [checked2, setChecked2] = useState<boolean>(false)

    return (
        <section >
            <div className='section-wrap'>
                {/* <div className="success-msg">
                    <p>Your password has been uppdated successfully you can now access to you account</p>
                    <Link to='/login'>Go to Login page</Link>
                </div> */}
                <h2>Getting back into your account</h2>
                <p>You can now change the password to recover your account.</p>
                <div className='info-input'>
                    <label htmlFor="userinfo">Enter new password</label>
                    <div className="info-input-warrper">
                        <input id="userinfo" type={!checked1 ? "password" : "text"} autoComplete='off' name='userInfo' autoCorrect="off" autoCapitalize='off' />
                        {!checked1 ? <FaEye onClick={() => { setChecked1(!checked1) }} /> : <FaEyeSlash onClick={() => { setChecked1(!checked1) }} />}
                    </div>
                </div>
                <div className='info-input'>
                    <label htmlFor="userinfo">Confirm new password</label>
                    <div className="info-input-warrper">
                        <input id="userinfo" type={!checked2 ? "password" : "text"} autoComplete='off' name='userInfo' autoCorrect="off" autoCapitalize='off' />
                        {!checked2 ? <FaEye onClick={() => { setChecked2(!checked2) }} /> : <FaEyeSlash onClick={() => { setChecked2(!checked2) }} />}
                    </div>
                </div>
                <div className="button-wrap">
                    <button>Set New password</button>
                </div>
            </div>
        </section>
    )
}
