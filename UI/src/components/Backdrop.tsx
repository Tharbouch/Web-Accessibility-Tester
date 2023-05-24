import { motion } from "framer-motion";
import { ReactNode } from "react";

export const Backdrop = (props: { children: ReactNode, onClick: any }) => {
    const { children, onClick } = props
    return (<motion.div
        className="backdrop"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {children}
    </motion.div>);
}