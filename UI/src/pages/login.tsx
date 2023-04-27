import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../components/Input";

const Login = () => {
    const navigate = useNavigate();
    const [buttonState, setButtonState] = useState(true);

    return (
        <section>
            <div className="container-login">
                <div className="container-svg">
                    <img src="/login.png" alt="illustration of people that have accessibility disabilities" />
                </div>
                <div className="form-wrapper">
                    <div className="switch-buttons" >
                        <button style={{ 'backgroundColor': buttonState ? '#1D3557' : '#CAE9FF', "color": buttonState ? '#FFF' : '#003249' }} onClick={() => { setButtonState(!buttonState); }}>
                            Log in
                        </button>
                        <button style={{ 'backgroundColor': !buttonState ? '#1D3557' : '#CAE9FF', "color": !buttonState ? '#FFF' : '#003249' }} onClick={() => { setButtonState(!buttonState); }}>
                            Sign up
                        </button>
                    </div>
                    <div className="title">
                        {buttonState ? (
                            <h2>Welcome Back!</h2>
                        ) : (
                            <h2>Welcome New Comer</h2>
                        )}
                        <p>Please enter your details.</p>
                    </div>
                    <form className="popup-form">
                        {buttonState ? (
                            <div className="login">
                                <div className="inputs">
                                    <Input classname="input-field" type="text" label="Username" />
                                    <Input classname="input-field" type="password" label="Password" />
                                </div>
                                <div className="help-row">
                                    <div>
                                        <input type="checkbox" name="" id="rememberme-button" />
                                        <label htmlFor="rememberme-button">Remember me</label>
                                    </div>
                                    <div>
                                        <Link to={"/forgetpassword"}>Forgot Password?</Link>
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
                                <div className="inputs">
                                    <Input classname="input-field" type="text" label="Full Name" />
                                    <Input classname="input-field" type="text" label="Username" />
                                    <Input classname="input-field" type="email" label="Email" />
                                    <Input classname="input-field" type="password" label="Password" />
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

export default Login;


{
    /*    const [formState, setFormState] = useState({
        username: "",
        password: "",
        fullName: "",
        email: "",
    });
    const [formErrors, setFormErrors] = useState({
        username: "",
        password: "",
        fullName: "",
        email: "",
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (buttonState) {
            // handle login submit
        } else {
            // handle signup submit
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formState.username.trim()) {
            errors.username = "Username is required";
            isValid = false;
        }

        if (!formState.password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        }

        if (!buttonState) {
            if (!formState.fullName.trim()) {
                errors.fullName = "Full name is required";
                isValid = false;
            }

            if (!formState.email.trim()) {
                errors.email = "Email is required";
                isValid = false;
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email)
            ) {
                errors.email = "Invalid email address";
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };
*/
}