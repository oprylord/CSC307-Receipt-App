import React from "react";

function Header() {
    const headerStyle = {
        backgroundColor: 'lightblue',
        padding: '10px',
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif'
    };
    return (
        <header>
            <h3>QuickSplit</h3>
            <nav ref={navRef}>
                <a href="/home">Home</a>
                <a href="/imageUpload">Image Upload</a>
                <a href="/imageCapture">Image Capture</a>
                <a href="/#">History</a>
                <button
                    className="navigation-button navigation-close-button"
                    onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <h1>Receipt Scanner</h1>
        </header>
    );
}

export default Header;