import { Link, Outlet } from "react-router-dom";
import { TiZoomOutline } from 'react-icons/ti'
import { FaUserCircle } from "react-icons/fa";
const Layout = () => {

    return (<>
        <header>
            <Link to='/'>
                <div className="logo">

                    <TiZoomOutline />
                    <h1>Accessibility Checker</h1>

                </div>
            </Link>
            <div className="nav">
                <Link to='guides'> Accessibility Guides</Link>
                <Link to='aboutus'> About us </Link>
                <Link to='account-access'><FaUserCircle /></Link>
            </div>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
    </>);
}

export default Layout;