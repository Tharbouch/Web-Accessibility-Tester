import { Link } from "react-router-dom"
import '../assets/notFound.css'
const NotFoud = () => {
    return (
        <section>
            <article className="not-found" >
                <h1>Oops!</h1>
                <p>Page Not Found</p>
                <div >
                    <Link to="/">Visit Our Homepage</Link>
                </div>
            </article>
        </section>

    )
}

export default NotFoud