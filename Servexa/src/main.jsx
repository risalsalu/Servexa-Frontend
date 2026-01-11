import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Fail loudly if Client ID is missing */}
    {!googleClientId ? (
      <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
        <h1>Configuration Error</h1>
        <p>Google Client ID is missing. Please check your .env file.</p>
        <p>VITE_GOOGLE_CLIENT_ID must be defined.</p>
      </div>
    ) : (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    )}
  </React.StrictMode>
);
