import { createContext, useState, useEffect } from "react";
// axios import removed for now to prevent unused variable warnings

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    // Keep this for when you eventually connect your real backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    // ── MOCK GET USER DATA ──
    // This allows your components to call getUserData() without crashing
    const getUserData = async () => {
        if (userData) {
            console.log("Current Mock User:", userData);
        }
    };

    // ── SILENCED AUTH CHECK ──
    useEffect(() => {
        // We leave this empty for now while using mock login.
        // Once your backend is live, you can put getAuthState() back here.
        console.log("App initialized in Mock Mode (No background network calls)");
    }, []);

    return (
        <AppContent.Provider
            value={{
                backendUrl,
                isLoggedin,
                setIsLoggedin,
                userData,
                setUserData,
                getUserData
            }}
        >
            {props.children}
        </AppContent.Provider>
    );
};