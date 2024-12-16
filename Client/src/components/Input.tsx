import { ChangeEvent } from "react";

interface InputProps {
    type: string;
    label: string;
    name: string;
    value: string;
    handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const Input = ({ type, label, value, name, handler, error }: InputProps) => (

    <div className="flex w-full flex-col gap-2 ">
        <div className='flex w-full flex-col gap-2'>
            <label htmlFor={label}>{label}</label>
            <input className={`border rounded focus-within:border-blue-500 transition-colors px-1 py-2 ${error !== "" ? 'border-red-600' :' border-gray-300'}`} id={label} value={value} type={`${type}`} name={`${name}`} autoComplete="true" onChange={(e: ChangeEvent<HTMLInputElement>) => { handler(e) }} required />       
        </div>
        {error !== "" && <p className="font-bold text-red-600 text-sm mb-1">{error}</p>}
    </div>
);


export default Input;