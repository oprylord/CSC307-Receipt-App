import React from "react";
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./CSS Files/Header.css";

function Header({ error }) {

    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle(
            "responsive_nav"
        );
    };

    return (
        <header>
            <h3>QuickSplit</h3>
            <nav ref={navRef}>
                <a href="/home">Home</a>
                <a href="/imageUpload">Image Upload</a>
                <a href="/#">Image Capture</a>
                <a href="/#">History</a>
                {error && error === 'User email is not available. Please log in again.' && <a href="/">Login</a>}
                <button
                    className="navigation-button navigation-close-button"
                    onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button
                className="navigation-button"
                onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Header;