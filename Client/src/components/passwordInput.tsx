import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
    value: string;
    handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const PasswordInput = ({ value, handler, error }: PasswordInputProps) => {

    const [checked, setChecked] = useState<boolean>(false)
    return (
        < div className="input">
            <div className='input-field'>
                <div className="input-container">
                    <input id="Password" value={value} type={!checked ? "password" : "text"} name="password" autoComplete="false" onChange={(e: ChangeEvent<HTMLInputElement>) => { handler(e) }} required />
                    <span></span>
                    <label htmlFor="Password">Password</label>
                </div>
                {!checked ? <FaEye onClick={() => { setChecked(!checked) }} /> : <FaEyeSlash onClick={() => { setChecked(!checked) }} />}
            </div>
            {error !== "" && <p className="error-input">{error}</p>}
        </div >)
};


export default PasswordInput