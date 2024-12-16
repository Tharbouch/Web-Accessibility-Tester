import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/loginForm';
import SignupForm from './components/SignupForm';
import { login } from '../../redux/slices/authSlice';
import { loginUser, registerUser } from '../../utils/authService';

const mapDispatch = {
  login,
};

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type AuthPageProps = PropsFromRedux;

const AuthPage = ({ login }:AuthPageProps) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);

  const clearGlobalError = () => setGlobalError('');

  const handleLogin = async (username: string, password: string, persist: boolean) => {
    try {
      const user = await loginUser({ username, password, persist });
      login(user);
      navigate('/dashboard');
    } catch (error: any) {
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
      throw error;
    }
  };

  return (
    <section className="flex flex-col md:flex-row w-full p-4 md:p-10 justify-between items-center min-h-screen">
      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center space-y-4 md:space-y-0 md:space-x-10">
        <div className="flex w-full md:w-1/2 h-full justify-center items-center">
          <img
            src="/images/login.png"
            alt="illustration of login"
            className="max-w-full h-auto object-contain"
          />
        </div>
        <div className="flex w-full md:w-1/2 h-auto flex-col items-center justify-center rounded-xl max-w-[600px] gap-4 p-4 shadow-[0_10px_8px_8px_rgba(174,206,228,0.29)] bg-white">
          <div className="flex w-3/4 items-center rounded-2xl justify-center p-1 bg-sky-200">
            <button
              className={`text-center w-full p-2 text-base rounded-2xl ${showLogin ? 'bg-sky-600 text-white' : 'text-black'}`}
              value="Login"
              onClick={() => { setShowLogin(true); clearGlobalError(); setAccountCreated(false); }}
            >
              Log In
            </button>
            <button
              className={`text-center w-full p-2 text-base rounded-2xl ${!showLogin ? 'bg-sky-600 text-white' : 'text-black'}`}
              value="Signup"
              onClick={() => { setShowLogin(false); clearGlobalError(); setAccountCreated(false); }}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center flex flex-col w-full my-2.5">
            {showLogin ? <h2 className="text-xl font-semibold">Welcome Back!</h2> : <h2 className="text-xl font-semibold">Welcome New Comer</h2>}
            <p>Please enter your details.</p>
          </div>
          {showLogin ? (
            <LoginForm onLogin={handleLogin} globalError={globalError} clearGlobalError={clearGlobalError} />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              globalError={globalError}
              clearGlobalError={clearGlobalError}
              accountCreated={accountCreated}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default connector(AuthPage);
