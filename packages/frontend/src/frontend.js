import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'
import LoginSignup from "./LoginSignup";
import PopUp from './PopUp.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

let i = 0;

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
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

    const HomePage = () => {
        return (
            <div>
                {isLoggedIn ? (
                    //Will be rendered on a successful login
                    <div>
                        <Header/>
                        <AddUsers onInputChange={handleInputChange}/>
                        <Table jsonData={jsonData} buttonLabels={buttonLabels}/>
                        <PopUp/>
                    </div>
                ) : (
                    // If not logged in or signed up, will direct here
                    <LoginSignup onLogin={handleLogin} />
                )}
            </div>
        );
    };

    return (
        <Router>
            <Routes>
                <Route path="/imageUpload" />
                <Route path="/history" />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

function fetchData() {
    return fetch("https://quicksplit.azurewebsites.net/receipt");
}

export default CreateTable;
