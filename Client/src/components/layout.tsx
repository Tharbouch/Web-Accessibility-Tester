import { useContext, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { TiZoomOutline } from 'react-icons/ti';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import axiosInstance from "../utils/axiosInstance";
import { connect,ConnectedProps } from 'react-redux';
import { stateType } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const mapStateToProps = (state: stateType) => ({
  loggedIn: state.auth.loggedIn,
  username: state.auth.user?.username
});

const mapDispatch = {
    logout,
  };
  

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Layout = ({ loggedIn ,username,logout}:PropsFromRedux) => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await axiosInstance({
            url: "/user/logout",
            method:"POST"
        });
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="flex justify-between items-center relative px-10 py-5 z-20 shadow-[0_10px_8px_1px_rgba(174,206,228,0.29)]">
                <Link aria-label="home page" to="/">
                    <div className="flex items-center">
                        <TiZoomOutline className='text-[40px]' />
                        <h1 className="font-bold text-2xl leading-5 ml-2">Accessibility Checker</h1>
                    </div>
                </Link>
                
                <nav className={`${isNavbarOpen ? 'fixed top-0 left-0 h-full w-full flex flex-col items-center justify-center gap-6 bg-white transform translate-y-0 transition-transform duration-1000' : 'hidden lg:flex items-center gap-8'}`}>
                    <Link 
                        to="guides" 
                        onClick={ () => setIsNavbarOpen(false)}
                        className="font-normal text-lg leading-5" 
                        aria-label="web accessibility guides page"
                    >
                        Accessibility Guides
                    </Link>
                    <Link 
                        to="aboutus" 
                        onClick={ () => setIsNavbarOpen(false)}
                        className="font-normal text-lg leading-5" 
                        aria-label="about us page"
                    >
                        About Us
                    </Link>
                    {
                        loggedIn ? (
                            <>
                                <Link 
                                    to="dashboard" 
                                       onClick={ () => setIsNavbarOpen(false)} 
                                    className="font-normal text-lg leading-5" 
                                    aria-label="Dashboard page"
                                >
                                    Dashboard
                                </Link>
                                <span className="font-medium text-lg leading-5">Hello, {username}</span>
                                <FiLogOut className="text-3xl cursor-pointer" onClick={handleLogOut} />
                            </>
                        ) : (
                            <Link 
                                to="/account-access" 
                                onClick={ () => setIsNavbarOpen(false)}
                                className="font-normal text-lg leading-5" 
                                aria-label="login and sign up page"
                            >
                                <FaUserCircle className="text-3xl" />
                            </Link>
                        )
                    }
                    <button className={isNavbarOpen ? 'absolute top-8 right-8 p-[5px] cursor-pointer bg-transparent border-none outline-none text-current text-[1.8rem]' : 'hidden'}    onClick={ () => setIsNavbarOpen(false)}>
                        <FaTimes />
                    </button>
                </nav>
                
                <button className="block lg:hidden p-[5px] cursor-pointer bg-transparent border-none outline-none text-current opacity-100 text-[1.8rem]"    onClick={ () => setIsNavbarOpen(true)}>
                    <FaBars />
                </button>
            </header>
            
            <main className='bg-gray-50'>
                <Outlet />
            </main>
            
            <footer className="flex w-full p-10 justify-center bg-sky-950 text-white">
                <ul className="flex w-[75%] items-center justify-between">
                    <li>
                        <div className="text-xl font-semibold">Knowledge Base</div>
                        <ul className='mt-2 space-y-1'>
                            <li><a href="#" className="text-base">Audit your website</a></li>
                            <li><a href="#" className="text-base">About Us</a></li>
                            <li><a href="#" className="text-base">How it works</a></li>
                            <li><a href="#" className="text-base">Blog</a></li>
                            <li><a href="#" className="text-base">Contact Us</a></li>
                            <li className="hidden">
                                <label className="modal-button" htmlFor="modal">
                                    <a className="text-base">Contact Us</a>
                                </label>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className="text-xl font-semibold">Legislations</div>
                        <ul className='mt-2 space-y-1'>
                            <li><a href="#" className="text-base">WCAG</a></li>
                            <li><a href="#" className="text-base">ADA</a></li>
                            <li><a href="#" className="text-base" aria-current="page">Section 508</a></li>
                            <li><a href="#" className="text-base">EAA/EN301549</a></li>
                            <li><a href="#" className="text-base">AODA</a></li>
                        </ul>
                    </li>
                    <li>
                        <div className="text-xl font-semibold">Legal</div>
                        <ul className='mt-2 space-y-1'>
                            <li><a href="#" className="text-base">Terms of Use</a></li>
                            <li><a href="#" className="text-base">Privacy Policy</a></li>
                            <li><a href="#" className="text-base">Cookie Policy</a></li>
                            <li><a href="#" className="text-base">Advertiser Disclosure</a></li>
                            <li>
                                <label>
                                    <a className="text-base">Data Protection</a>
                                </label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </footer>
        </>
    );
};

export default connector(Layout);
