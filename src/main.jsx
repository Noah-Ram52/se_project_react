import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App/App.jsx";
import "./index.css";

// Get basename from environment - empty for development, /se_project_react for production
const basename = import.meta.env.PROD
  ? "/se_project_react"
  : "/se_project_react/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
