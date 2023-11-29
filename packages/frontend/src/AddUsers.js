import React, {useState} from "react";
import "./CSS Files/AddUsers.css"

function InputField({ onInputChange }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue !== "") {
            onInputChange(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }} className={"userForm"}>
            <input className={"username"}
                style={{ display: 'inline-block', width: '70%', justifyContent: 'center', marginRight: '10px'}}
                type="text"
                placeholder={"Input a name to update or add new buttons"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className={"submitButton"}>Submit</button>
        </form>
    );
}

export default InputField;

