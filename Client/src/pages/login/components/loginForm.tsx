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
        <form onSubmit={handleSubmit}>
            {globalError && <p className="error">{globalError}</p>}
            <div className="inputs">
                <Input type="text" label="Username" name="username" value={formData.username} handler={handleChange} error={errors.username} />
                <PasswordInput value={formData.password} handler={handleChange} error={errors.password} />
            </div>
            <div className="help-row">
                <div>
                    <input type="checkbox" checked={formData.persist} onChange={handleChange} name="persist" id="rememberme-button" />
                    <label htmlFor="rememberme-button">Remember me</label>
                </div>
                {/* Link to password recovery later */}
            </div>
            <div className="button">
                <button className="submitButton" type="submit">Log in</button>
            </div>
        </form>
    );
}
