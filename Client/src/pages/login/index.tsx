import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../context/authContext';
import LoginForm from './components/loginForm';
import SignupForm from './components/SignupForm';
import { loginUser, registerUser } from '../../utils/authService';

export default function AuthPage() {
    const navigate = useNavigate();
    const { authDispatch } = useContext(AuthContext) as AuthContextType;
    const [showLogin, setShowLogin] = useState(true);
    const [globalError, setGlobalError] = useState('');
    const [accountCreated, setAccountCreated] = useState(false);

    const clearGlobalError = () => setGlobalError('');

    const handleLogin = async (username: string, password: string, persist: boolean) => {
        try {
            const user = await loginUser({ username, password, persist });
            authDispatch({ type: 'LOGIN', user });
            navigate('/dashboard');
        } catch (error: any) {
            // Specific error handling for login
            const message = error.response?.data?.message || 'Something went wrong';
            setGlobalError(message);
        }
    };

    const handleSignup = async (fullname: string, username: string, email: string, password: string) => {
        try {
            await registerUser({ fullname, username, email, password });
            setAccountCreated(true);
            setShowLogin(true);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong';
            setGlobalError(message);
            throw error; // Rethrow to allow SignupForm to handle specific errors
        }
    };

    return (
        <section className="login-section">
            <div className="container-login">
                <div className="container-svg">
                    <img src="/images/login.png" alt="illustration of login" />
                </div>
                <div className="form-wrapper">
                    <div className="switch-buttons">
                        <button 
                            className={showLogin ? 'active-button' : 'inactive-button'} 
                            value="Login" 
                            onClick={() => { setShowLogin(true); clearGlobalError(); setAccountCreated(false); }}
                        >
                            Log In
                        </button>
                        <button 
                            className={!showLogin ? 'active-button' : 'inactive-button'} 
                            value="Signup" 
                            onClick={() => { setShowLogin(false); clearGlobalError(); setAccountCreated(false); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="form-title">
                        {showLogin ? <h2>Welcome Back!</h2> : <h2>Welcome New Comer</h2>}
                        <p>Please enter your details.</p>
                    </div>

                    {showLogin ? (
                        <LoginForm onLogin={handleLogin} globalError={globalError} clearGlobalError={clearGlobalError} />
                    ) : (
                        <SignupForm onSignup={handleSignup} globalError={globalError} clearGlobalError={clearGlobalError} accountCreated={accountCreated} />
                    )}
                </div>
            </div>
        </section>
    );
}
