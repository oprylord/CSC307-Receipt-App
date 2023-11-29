import React from "react";
import ReactDOMClient from "react-dom/client";
import "./CSS Files/index.css";
import MyApp from "./frontend.js";


// Create the container
const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the Rootindex.css
root.render(<MyApp />);