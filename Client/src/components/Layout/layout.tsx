import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { TiZoomOutline } from 'react-icons/ti';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './layout.css'

const Layout = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const showNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

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
                    <Link to="guides" aria-label="web accessibility guides page">
                        Accessibility Guides
                    </Link>
                    <Link to="aboutus" aria-label="about us page">
                        About us
                    </Link>
                    <Link to="account-access" aria-label="login and sign up page">
                        <FaUserCircle />
                    </Link>
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
            <footer></footer>
        </>
    );
};

export default Layout;
