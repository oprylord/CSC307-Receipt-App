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
            <h1>Receipt Scanner</h1>
        </header>
    );
}

export default Header;