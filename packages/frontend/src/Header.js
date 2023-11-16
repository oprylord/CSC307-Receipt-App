import React from "react";
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./CSS Files/Header.css";

function Header() {

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
                <a href="/">Home</a>
                <a href="/#">Image Upload</a>
                <a href="/#">Image Capture</a>
                <a href="/#">History</a>
                <button
                    className="nav-btn nav-close-btn"
                    onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button
                className="nav-btn"
                onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Header;