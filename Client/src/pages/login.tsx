import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../components/Input";
import PasswordInput from "../components/passwordInput";
import axios, { AxiosRequestConfig } from "axios";
import { AuthContext, AuthContextType } from "../context/authContext";

interface SignUpForm {
    username: string;
    password: string;
    fullname: string;
    email: string;
    userExists: boolean
}

interface LogInForm {
    username: string;
    password: string;
    persist: boolean
}


export default function Login() {
    const navigate = useNavigate();
    const authContext = useContext<AuthContextType | null>(AuthContext)
    const { authState, authDispatch } = authContext as AuthContextType;
    const [buttonState, setButtonState] = useState<boolean>(true);
    const [error, setError] = useState<string>('')
    const [accountCreated, setAccountCreated] = useState<boolean>(false)
    const [logInForm, setLogInForm] = useState<LogInForm>({
        username: "",
        password: "",
        persist: false
    })
    const [singUpForm, setSingUpForm] = useState<SignUpForm>({
        username: "",
        password: "",
        fullname: "",
        email: "",
        userExists: false
    })

    const [formErrors, setFormErrors] = useState<SignUpForm>({
        username: "",
        password: "",
        fullname: "",
        email: "",
        userExists: false
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (buttonState) {
            setLogInForm((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        }
        else {
            setSingUpForm((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        }
    }

    const handleSwitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setButtonState(!buttonState);
        if (e.currentTarget.value === 'Login') {
            setSingUpForm({
                username: "",
                password: "",
                fullname: "",
                email: "",
                userExists: false
            })
        }
        else {
            setLogInForm({
                username: "",
                password: "",
                persist: false
            })
        }

        setFormErrors({
            username: "",
            password: "",
            fullname: "",
            email: "",
            userExists: false
        })

    }
    const validateForm = (): boolean => {
        let formError: SignUpForm = { ...formErrors };
        let isValid = true;


        if (!buttonState) {
            if (!singUpForm.username.trim()) {
                formError.username = "*Username is required";
                isValid = false;
            }

            if (!singUpForm.password.trim()) {
                formError.password = "*Password is required";
                isValid = false;
            }

            if (!singUpForm.fullname.trim()) {
                formError.fullname = "*Full name is required";
                isValid = false;
            }
            else if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(singUpForm.password)) {
                formError.password = "*Invalid password";
                isValid = false;
            }

            if (!singUpForm.email.trim()) {
                formError.email = "*Email is required";
                isValid = false;
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(singUpForm.email)) {
                formError.email = "*Invalid email address";
                isValid = false;
            }

        }
        else {
            if (!logInForm.username.trim()) {
                formError.username = "*Username is required";
                isValid = false;
            }

            if (!logInForm.password.trim()) {
                formError.password = "*Password is required";
                isValid = false;
            }
        }
        setFormErrors(formError)
        return isValid;
    }

    const HandelOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let isValid = validateForm()
        if (isValid) {
            const csrfToken = document.cookie.split('=')[1]
            await handelrequest({
                baseURL: 'http://localhost:4000/api/v1/user',
                url: buttonState ? "/login" : "/register",
                method: 'post',
                headers: {
                    "Content-Type": 'application/json',
                    "X-CSRF-Token": `${csrfToken}`,
                },
                data: buttonState ? logInForm : singUpForm,
                withCredentials: true
            })
            buttonState ?
                setLogInForm({
                    username: "",
                    password: "",
                    persist: false
                })
                :
                setSingUpForm({
                    username: "",
                    password: "",
                    fullname: "",
                    email: "",
                    userExists: false
                })
        }
    }

    const handelrequest = async (config: AxiosRequestConfig<any>) => {

        axios(config)
            .then(async (response) => {
                if (response.status === 201) {
                    setAccountCreated(true)
                    setButtonState(true)
                }
                if (response.status === 200) {
                    authDispatch({ type: 'LOGIN', user: response.data });
                    navigate('/dashboard')
                }
            })
            .catch((err) => {
                if (err.message === 'Network Error') {
                    alert(err.message)
                }
                else if (err?.response.status === 500) {
                    setError('something went wrong')
                }
                else {
                    const error = err.response.data.message;
                    if (buttonState) {
                        if (error.includes("username")) {
                            setFormErrors((prevState) => ({
                                ...prevState,
                                username: `*${error}`
                            }));
                        } else {
                            setFormErrors((prevState) => ({
                                ...prevState,
                                password: `*${error}`
                            }));
                        }
                    } else {
                        if (error.includes("user already exists")) {
                            setFormErrors((prevState) => ({
                                ...prevState,
                                userExists: true
                            }));
                        }
                    }
                }
            })
    }

    return (
        <section className="login-section">
            <div className="container-login">
                <div className="container-svg">
                    <img src="/images/login.png" alt="illustration of login" />
                </div>
                <div className="form-wrapper">
                    <div className="switch-buttons" >
                        <button value="Login" style={{ 'backgroundColor': buttonState ? '#1D3557' : '#CAE9FF', "color": buttonState ? '#FFF' : '#003249' }} onClick={(e) => { handleSwitch(e) }}>
                            Log in
                        </button>
                        <button value="Signup" style={{ 'backgroundColor': !buttonState ? '#1D3557' : '#CAE9FF', "color": !buttonState ? '#FFF' : '#003249' }} onClick={(e) => { handleSwitch(e) }}>
                            Sign up
                        </button>
                    </div>
                    {
                        accountCreated
                        &&
                        <div className="success-msg">
                            <p>Your account has been created successfully</p>
                        </div>
                    }

                    <div className="form-title">
                        {buttonState ? (
                            <h2>Welcome Back!</h2>
                        ) : (
                            <h2>Welcome New Comer</h2>
                        )}
                        <p>Please enter your details.</p>
                    </div>
                    <form className="popup-form" onSubmit={(e: FormEvent<HTMLFormElement>) => { HandelOnSubmit(e) }} >
                        {buttonState ? (
                            <div className="login">
                                {error !== '' && <p className="error">{error}</p>}
                                <div className="inputs">
                                    <Input type="text" label="Username" value={logInForm.username} name="username" handler={handleChange} error={formErrors.username} />
                                    <PasswordInput value={logInForm.password} handler={handleChange} error={formErrors.password} />
                                </div>
                                <div className="help-row">
                                    <div>
                                        <input type="checkbox" checked={logInForm.persist} onChange={(e) => { setLogInForm((prevState) => ({ ...prevState, persist: e.target.checked })) }} id="rememberme-button" />
                                        <label htmlFor="rememberme-button">Remember me</label>
                                    </div>
                                    <div>
                                        <Link to="/password-recovery">Forgot Password?</Link>
                                    </div>
                                </div>
                                <div className="button">
                                    <button className="submitButton" type="submit">
                                        Log in
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="signup">
                                {error !== '' && <p className="error">{error}</p>}
                                {formErrors.userExists && <p className="error">*user already exists , use unique email and username</p>}
                                <div className="inputs">
                                    <Input type="text" label="Full Name" value={singUpForm.fullname} name="fullname" handler={handleChange} error={formErrors.fullname} />
                                    <Input type="text" label="Username" value={singUpForm.username} name="username" handler={handleChange} error={formErrors.username} />
                                    <Input type="email" label="Email" value={singUpForm.email} name="email" handler={handleChange} error={formErrors.email} />
                                    <PasswordInput value={singUpForm.password} handler={handleChange} error={formErrors.password} />
                                </div>
                                <div className="button">
                                    <button className="submitButton" type="submit">
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};