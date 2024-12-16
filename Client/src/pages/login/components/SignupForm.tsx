import { useState, ChangeEvent, FormEvent } from 'react';
import Input from '../../../components/Input';
import PasswordInput from '../../../components/passwordInput';
import { validateSignupForm } from '../../../utils/validation';

interface SignupProps {
    onSignup: (fullname: string, username: string, email: string, password: string) => Promise<void>;
    globalError: string;
    clearGlobalError: () => void;
    accountCreated: boolean;
}

const SignupForm = ({ onSignup, globalError, clearGlobalError, accountCreated }: SignupProps) =>{
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        userExists: false,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearGlobalError();
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateSignupForm(formData);
        setErrors(validationErrors);
        if (!validationErrors.fullname && !validationErrors.username && !validationErrors.email && !validationErrors.password) {
            try {
                await onSignup(formData.fullname, formData.username, formData.email, formData.password);
            } catch (error: any) {
                if (error.response?.data?.message.includes("user already exists")) {
                    setErrors((prev) => ({ ...prev, userExists: true }));
                }
            }
        }
    };

    return (
        <form className="flex flex-col w-full" noValidate onSubmit={handleSubmit}>
            {globalError && <p className="font-bold text-red-600 text-base mb-1">{globalError}</p>}
            {accountCreated && (
                <div className="text-green-600 font-semibold mb-2">
                    Your account has been created successfully
                </div>
            )}
            {errors.userExists && (
                <p className="text-red-600 font-bold mb-2">
                    *User already exists, use a unique email and username
                </p>
            )}
            <div className="flex flex-col justify-start mb-2 space-y-2">
                <Input type="text" label="Full Name" name="fullname" value={formData.fullname} handler={handleChange} error={errors.fullname} />
                <Input type="text" label="Username" name="username" value={formData.username} handler={handleChange} error={errors.username} />
                <Input type="email" label="Email" name="email" value={formData.email} handler={handleChange} error={errors.email} />
                <PasswordInput value={formData.password} handler={handleChange} error={errors.password} />
            </div>
            <div className="flex w-full my-2">
                <button className="rounded-2xl bg-sky-600 text-white text-center w-full py-3 px-9" type="submit">Sign up</button>
            </div>
        </form>
    );
}

export default SignupForm;