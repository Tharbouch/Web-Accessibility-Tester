import { ChangeEvent } from "react";

const Input = ({ type, label, value, name, handler, error }: any) => (

    <div className="input">
        <div className='input-field'>
            <input id={label} value={value} type={`${type}`} name={`${name}`} autoComplete="true" onChange={(e: ChangeEvent<HTMLInputElement>) => { handler(e) }} required />
            <span></span>
            <label htmlFor={label}>{label}</label>
        </div>
        {error !== "" && <p className="error-input">{error}</p>}
    </div>
);


export default Input;