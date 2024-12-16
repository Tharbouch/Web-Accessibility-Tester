import { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../../../components/Input';
import PasswordInput from '../../../components/passwordInput';
import { validateLoginForm } from '../../../utils/validation';

interface LoginProps {
    onLogin: (username: string, password: string, persist: boolean) => Promise<void>;
    globalError: string;
    clearGlobalError: () => void;
}

export default function LoginForm({ onLogin, globalError, clearGlobalError }: LoginProps) {
    const [formData, setFormData] = useState({ username: '', password: '', persist: false });
    const [errors, setErrors] = useState({ username: '', password: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearGlobalError();
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLoginForm(formData);
        setErrors(validationErrors);
        if (!validationErrors.username && !validationErrors.password) {
            await onLogin(formData.username, formData.password, formData.persist);
        }
    };

    return (
        <form className="flex flex-col gap-2 w-full" noValidate onSubmit={handleSubmit}>
            {globalError && <p className="font-bold text-red-600 text-base mb-1 ">{globalError}</p>}
            <div className="flex flex-col items-center space-y-2">
                <Input type="text" label="Username" name="username" value={formData.username} handler={handleChange} error={errors.username} />
                <PasswordInput value={formData.password} handler={handleChange} error={errors.password} />
            </div>
            <div className="flex w-full justify-start mb-2 items-center space-x-2">
                <input type="checkbox" checked={formData.persist} onChange={handleChange} name="persist" id="rememberme-button" />
                <label htmlFor="rememberme-button">Remember me</label>
                {/* Link to rest password later */}
            </div>
            <div className="flex w-full my-2">
                <button className="rounded-2xl bg-sky-600 text-white text-center w-full py-3 px-9" type="submit">Log in</button>
            </div>
        </form>
    );
}
