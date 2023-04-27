const Input = ({ classname, type, label, handler }: any) => (
    <div className={`${classname}`}>
        <input id={label} type={`${type}`} onChange={(e) => { handler(e.target.value) }} required />
        <span></span>
        <label htmlFor={label}>{label}</label>
    </div>
);


export default Input;