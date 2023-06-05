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
    const urlRegex = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/;

    const navigate = useNavigate();
    const [url, setUrl] = useState<string>('')
    const [standard, setStandard] = useState<string>('WCAG')
    const [valid, setValid] = useState<boolean>(true)

    const handelOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (urlRegex.test(url)) {
            handleClose()
            navigate(`/audit?url=${encodeURIComponent(url)}`, { state: { url, standard, newTest: true } });
        }
        else {
            setValid(false)
        }

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
                <h2>Type the website's URL , Choose your test standard and run the check</h2>
                <div className="search-wrap">
                    <div className="search_box">
                        <div className="params">
                            <input type="text" name='url' autoFocus={true} autoComplete='off' className="input" placeholder="Type Website's URL" onChange={(e) => { setUrl(e.target.value) }} />
                            <select name="standard" onChange={(e) => { setStandard(e.target.value) }}>
                                <option value="WCAG">WCAG</option>
                                <option value="Section 508">Secton 508</option>
                            </select>

                        </div>
                        <button className="btn" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { handelOnClick(e) }}>Check Website</button>
                    </div>

                </div>
                {!valid && <div className="error-wrap">
                    <span>*URL is not valid</span>
                </div>}
            </motion.div>
        </Backdrop>
    );
}

export default LunchTest;