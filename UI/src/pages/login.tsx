import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../components/Input";
import PasswordInput from "../components/passwordInput";
import axios, { AxiosRequestConfig } from "axios";

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
}

export default function Login() {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState<boolean>(true);
    const [accountCreated, setAccountCreated] = useState<boolean>(false)
    const [logInForm, setLogInForm] = useState<LogInForm>({
        username: "",
        password: ""
    })
    const [loginErrors, setLogInErrors] = useState<LogInForm>({
        username: "",
        password: ""
    })
    const [signupErrors, setSignUpErrors] = useState<SignUpForm>({
        username: "",
        password: "",
        fullname: "",
        email: "",
        userExists: false
    })
    const [singUpForm, setSingUpForm] = useState<SignUpForm>({
        username: "",
        password: "",
        fullname: "",
        email: "",
        userExists: false
    })
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
    };
    const HandelOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let config: AxiosRequestConfig<any> = {
            baseURL: 'http://localhost:4000/api/v1/user',
            method: 'post'
        }
        let isValid = validateForm()
        if (isValid) {
            config.url = buttonState ? "/login" : "/register"
            config.data = buttonState ? logInForm : singUpForm
            buttonState ?
                setLogInForm({
                    username: "",
                    password: ""
                })
                :
                setSingUpForm({
                    username: "",
                    password: "",
                    fullname: "",
                    email: "",
                    userExists: false
                })

            await handelrequest(config)
        }
    }
    const handelrequest = async (config: AxiosRequestConfig<any>) => {
        axios(config)
            .then((response) => {
                if (response.status === 201) {
                    setAccountCreated(true)
                    setButtonState(true)
                }
                if (response.status === 200) {
                    navigate('/')
                }
            })
            .catch((err) => {
                if (err.message === 'Network Error') {
                    alert(err.message)
                }
                else if (err?.response.status === 500) {
                    alert(err.response.data.message)
                }
                else {
                    const error = err.response.data.message;
                    if (buttonState) {
                        if (error.includes("username")) {
                            setLogInErrors((prevState) => ({
                                ...prevState,
                                username: `*${error}`
                            }));
                        } else {
                            setLogInErrors((prevState) => ({
                                ...prevState,
                                password: `*${error}`
                            }));
                        }
                    } else {
                        if (error.includes("user already exists")) {
                            setSignUpErrors((prevState) => ({
                                ...prevState,
                                userExists: true
                            }));
                        }
                    }
                }
            })
    }
    const validateForm = (): boolean => {
        let signUpErrors: SignUpForm = {
            username: "",
            password: "",
            fullname: "",
            email: "",
            userExists: false
        };

        let logInErrors: LogInForm = {
            username: "",
            password: ""
        }
        let isValid = true;

        if (!buttonState) {
            if (!singUpForm.username.trim()) {
                signUpErrors.username = "*Username is required";
            }

            if (!singUpForm.password.trim()) {
                signUpErrors.password = "*Password is required";
            }

            if (!singUpForm.fullname.trim()) {
                signUpErrors.fullname = "*Full name is required";
            }
            else if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(singUpForm.password)) {
                signUpErrors.password = "*Invalid password";
            }

            if (!singUpForm.email.trim()) {
                signUpErrors.email = "*Email is required";
                isValid = false;
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(singUpForm.email)) {
                signUpErrors.email = "*Invalid email address";
            }

            if (Object.values(signUpErrors).some((error) => error !== "")) {
                isValid = false;
            }

            setSignUpErrors(signUpErrors)
        }
        else {
            if (!logInForm.username.trim()) {
                logInErrors.username = "*Username is required";
            }

            if (!logInForm.password.trim()) {
                logInErrors.password = "*Password is required";
            }
            if (Object.values(logInErrors).some((error) => error !== "")) {
                isValid = false;
            }
            setLogInErrors(logInErrors)

        }
        return isValid;
    };

    return (
        <section className="login-section">
            <div className="container-login">
                <div className="container-svg">
                    <img src="/images/login.png" alt="illustration of login" />
                </div>
                <div className="form-wrapper">
                    <div className="switch-buttons" >
                        <button style={{ 'backgroundColor': buttonState ? '#1D3557' : '#CAE9FF', "color": buttonState ? '#FFF' : '#003249' }} onClick={(e) => {
                            e.preventDefault()
                            setButtonState(!buttonState);
                            setSingUpForm({
                                username: "",
                                password: "",
                                fullname: "",
                                email: "",
                                userExists: false
                            })
                        }}>
                            Log in
                        </button>
                        <button style={{ 'backgroundColor': !buttonState ? '#1D3557' : '#CAE9FF', "color": !buttonState ? '#FFF' : '#003249' }} onClick={(e) => {
                            e.preventDefault()
                            setButtonState(!buttonState);
                            setLogInForm({
                                username: "",
                                password: ""
                            })
                        }}>
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
                                <div className="inputs">
                                    <Input type="text" label="Username" value={logInForm.username} name="username" handler={handleChange} error={loginErrors.username} />
                                    <PasswordInput value={logInForm.password} handler={handleChange} error={loginErrors.password} />

                                </div>
                                <div className="help-row">
                                    <div>
                                        <input type="checkbox" name="" id="rememberme-button" />
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
                                {signupErrors.userExists && <p className="error">*user already exists , use unique email and username</p>}
                                <div className="inputs">
                                    <Input type="text" label="Full Name" value={singUpForm.fullname} name="fullname" handler={handleChange} error={signupErrors.fullname} />
                                    <Input type="text" label="Username" value={singUpForm.username} name="username" handler={handleChange} error={signupErrors.username} />
                                    <Input type="email" label="Email" value={singUpForm.email} name="email" handler={handleChange} error={signupErrors.email} />
                                    <PasswordInput value={singUpForm.password} handler={handleChange} error={signupErrors.password} />
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