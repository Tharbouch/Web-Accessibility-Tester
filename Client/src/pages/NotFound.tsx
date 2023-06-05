import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
const NotFoud = () => {

    return (
        <section>
            <div className="not-found" >
                <h1>Oops!</h1>
                <p>Page Not Found</p>
                <div>
                    <img src="/images/error404.jpg" alt="" />
                </div>
                <div >
                    <Link to="/">Visit Our Homepage</Link>
                </div>
            </div>
        </section>

    )
}

export default NotFoud