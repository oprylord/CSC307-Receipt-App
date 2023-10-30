import React, {useState} from "react";
import './CSS Files/LoginSignup.css'

const LoginSignup = ({ onLogin }) => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = () => {
        // Validate the username and password here (you may use a backend API)
        // If successful, call the onLogin function to set isLoggedIn to true
        onLogin();
    };

    return (
        <div className={'cont'}>
            <div className={"header"}>
                <div className={"text"}>{ action }</div>
                <div className={"underline"}></div>
            </div>
            <div className={"inputs"}>
                {action==="Login"?<div></div>:
                    <div className={"input"}>
                        <img src={""} alt={""}/>
                        <input type={"name"} placeholder={"Name"}/>
                    </div>}
                <div className={"input"}>
                    <img src={""} alt={""}/>
                    <input type={"email"} placeholder={"Email"}/>
                </div>
                <div className={"input"}>
                    <img src={""} alt={""}/>
                    <input type={"password"} placeholder={"Password"}/>
                </div>
            </div>
            <div className={"submitContainer"}>
                <div className={action==="Login"?"submit grey":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==="Sign Up"?"submit grey":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup