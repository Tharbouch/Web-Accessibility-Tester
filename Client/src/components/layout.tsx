import { useContext, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { TiZoomOutline } from 'react-icons/ti';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext, AuthContextType } from '../context/authContext';

const Layout = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const navigate = useNavigate()

    const authContext = useContext<AuthContextType | null>(AuthContext)
    const { authState, authDispatch } = authContext as AuthContextType;

    const showNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleLogOut = async () => {
        await axios({
            url: "http://localhost:4000/api/v1/user/logout",
            method: 'post',
            withCredentials: true
        });
        authDispatch({ type: 'LOGOUT' });
        navigate('/')
    }

    return (
        <>
            <header>
                <Link aria-label="home page" to="/">
                    <div className="logo">
                        <TiZoomOutline />
                        <h1>Accessibility Checker</h1>
                    </div>
                </Link>
                <nav className={`nav ${isNavbarOpen ? 'responsive_nav' : ''}`}>
                    <Link to="guides" onClick={showNavbar} aria-label="web accessibility guides page">
                        Accessibility Guides
                    </Link>
                    <Link to="aboutus" onClick={showNavbar} aria-label="about us page">
                        About us
                    </Link>
                    {
                        authState.loggedIn ?
                            <>
                                <Link to="dashboard" onClick={showNavbar} aria-label="Dashboard page">
                                    Dashboard
                                </Link>
                                <span>Hello, {authState.user?.username}</span>
                                <FiLogOut onClick={handleLogOut} />
                            </>
                            :
                            <Link to="account-access" onClick={showNavbar} aria-label="login and sign up page">
                                <FaUserCircle />
                            </Link>
                    }
                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <FaTimes />
                    </button>
                </nav>
                <button className="nav-btn" onClick={showNavbar}>
                    <FaBars />
                </button>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <ul className="footer-nav">
                    <li >
                        <div className="h3">Knowledge base</div>
                        <ul className='sublist'>
                            <li >
                                <a href="#">Audit your website</a>
                            </li>
                            <li >
                                <a href="#">About Us</a>
                            </li>
                            <li>
                                <a href="#">How it works</a>
                            </li>
                            <li >
                                <a href="#">Blog</a>
                            </li>
                            <li >
                                <a href="#">Contact Us</a>
                            </li>
                            <li style={{ display: "none" }}>
                                <label className="modal-button" htmlFor="modal">
                                    <a>Contact Us</a>
                                </label>
                            </li>
                        </ul>
                    </li>
                    <li >
                        <div className="h3">Legislations</div>
                        <ul className='sublist'>
                            <li>
                                <a href="#">WCAG</a>
                            </li>
                            <li>
                                <a href="#">ADA</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page">
                                    Section 508
                                </a>
                            </li>
                            <li>
                                <a href="#">EAA/EN301549</a>
                            </li>
                            <li>
                                <a href="#">AODA</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className="h3">Legal</div>
                        <ul className='sublist'>
                            <li>
                                <a href="#">Terms of Use</a>
                            </li>
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#">Cookie Policy</a>
                            </li>
                            <li>
                                <a href="#">Advertiser Disclosure</a>
                            </li>
                            <li>
                                <label >
                                    <a>Data Protection</a>
                                </label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </footer>
        </>
    );
};

export default Layout;
