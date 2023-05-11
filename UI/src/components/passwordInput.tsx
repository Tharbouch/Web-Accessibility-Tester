import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const PasswordInput = ({ value, handler, error }: any) => {

    const [checked, setChecked] = useState<boolean>(false)
    return (
        < div className="input">
            <div className='input-field'>
                <div className="input-container">
                    <input id="Password" value={value} type={!checked ? "password" : "text"} name="password" onChange={(e: ChangeEvent<HTMLInputElement>) => { handler(e) }} required />
                    <span></span>
                    <label htmlFor="Password">Password</label>
                </div>
                {!checked ? <FaEye onClick={() => { setChecked(!checked) }} /> : <FaEyeSlash onClick={() => { setChecked(!checked) }} />}
            </div>
            {error !== "" && <p className="error">{error}</p>}
        </div >)
};


export default PasswordInput