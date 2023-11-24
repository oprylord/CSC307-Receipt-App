import React, {useState} from "react";
import './CSS Files/LoginSignup.css'

const LoginSignup = ({ onLogin }) => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);

    const handleLoginClick = async () => {
        try {
            const data = { email, password };
            const response = await fetch("https://quicksplit.azurewebsites.net/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
                onLogin();
            } else {
                const errorData = await response.json();
                console.error(errorData.error); // Error message from the server
                setErrors([errorData.error]);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            // Handle network or other unexpected errors.
        }
    };

    const handleSignUpClick = async () => {
        try {
            const data = { username, password, email };
            const response = await fetch("https://quicksplit.azurewebsites.net/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
                onLogin();
            } else {
                const errorData = await response.json();
                console.error(errorData.error); // Error message from the server
                setErrors([errorData.error]);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            // Handle network or other unexpected errors.
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

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
                        <input type={"name"} placeholder={"Name"}
                               value={username}
                               onChange={handleUsernameChange}/>
                    </div>}
                <div className={"input"}>
                    <img src={""} alt={""}/>
                    <input type={"email"} placeholder={"Email"}
                        value={email}
                        onChange={handleEmailChange}/>
                </div>
                <div className={"input"}>
                    <img src={""} alt={""}/>
                    <input type={"password"} placeholder={"Password"}
                        value={password}
                        onChange={handlePasswordChange}/>
                </div>
            </div>
            <div className="error-messages">
                {errors.map((error, index) => (
                    <div key={index} className="error-message">
                        {error}
                    </div>
                ))}
            </div>
            <div className={"submitContainer"}>
                <div className={action==="Login"?"submit grey":"submit"} onClick={()=>{setAction("Sign Up"); handleSignUpClick()}}>Sign Up</div>
                <div className={action==="Sign Up"?"submit grey":"submit"} onClick={()=>{if(action==="Login") {handleLoginClick()} else {setAction("Login");}}}>Login</div>
            </div>
        </div>
    )
}

export default LoginSignup
