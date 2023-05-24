import { motion } from "framer-motion";
import { Backdrop } from "./Backdrop";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500
        }
    },
    exit: {
        y: "100vh",
        opacity: 0
    },
};
const LunchTest = ({ handleClose }: any) => {
    const navigate = useNavigate();
    const [url, setUrl] = useState<string>('')

    const handelOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        navigate(`/audit?url=${encodeURIComponent(url)}`, { state: { url, newTest: true } });
    }

    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => { e.stopPropagation() }}
                className="model"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="search-wrap">
                    <div className="search_box">
                        <input type="text" name='url' autoFocus={true} autoComplete='off' className="input" placeholder="Type Website's URL" onChange={(e) => { setUrl(e.target.value) }} />
                        <button className="btn" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { handelOnClick(e) }}>Check Website</button>
                    </div>
                </div>
            </motion.div>
        </Backdrop>
    );
}

export default LunchTest;