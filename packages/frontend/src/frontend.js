import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'
import LoginSignup from "./LoginSignup";

let i = 0;

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        // Still need to edit
        // Perform authentication logic (e.g., check username and password)
        // If authentication is successful, set isLoggedIn to true
        setIsLoggedIn(true);
    };

    const handleInputChange = (newLabel) => {
        const newButtonLabels = [...buttonLabels];
        newButtonLabels[i++] = newLabel;
        setButtonLabels(newButtonLabels);
    };

    useEffect(() => {
        fetchData()
            .then((res) => res.json())
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => { console.log(error); });
    }, [] );

    return (
        <div>
            {isLoggedIn ? (
                //Will be rendered on a successful login
                <div>
                    <Header/>
                    <AddUsers onInputChange={handleInputChange}/>
                    <Table jsonData={jsonData} buttonLabels={buttonLabels}/>
                </div>
            ) : (
                // If not logged in or signed up, will direct here
                <LoginSignup onLogin={handleLogin} />
            )}
        </div>
    );
}

function fetchData() {
    const promise = fetch("http://localhost:8000/receipt");
    return promise;
}

export default CreateTable;