import { Link, Outlet } from "react-router-dom";
import { TiZoomOutline } from 'react-icons/ti'
import { FaUserCircle } from "react-icons/fa";
const Layout = () => {

    return (<>
        <header>
            <Link aria-label='home page ' to='/'>
                <div className="logo">
                    <TiZoomOutline />
                    <h1>Accessibility Checker</h1>
                </div>
            </Link>
            <div className="nav">
                <Link to='guides' aria-label='web accessibility guides page '> Accessibility Guides</Link>
                <Link to='aboutus' aria-label='about us page '> About us </Link>
                <Link to='account-access' aria-label='login and sign up page'><FaUserCircle /></Link>
            </div>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
    </>);
}

export default Layout;