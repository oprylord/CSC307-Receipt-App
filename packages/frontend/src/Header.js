import React from "react";

function Header() {
    const headerStyle = {
        backgroundColor: 'lightblue',
        padding: '10px',
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif'
    };
    return (
        <header style={headerStyle}>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <h1>Receipt Scanner</h1>
        </header>
    );
}

export default Header;