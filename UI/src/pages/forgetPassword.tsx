import React from 'react'

export default function ForgetPassword() {
    return (
        <section>
            <div>
                <h2>Getting back into your account</h2>
                <p>Tell us some information about your account.</p>
                <div>
                    <input type="text" autoComplete='off' name='userInfo' autoCorrect="off" autoCapitalize='off' />
                </div>
            </div>

        </section>
    )
}
