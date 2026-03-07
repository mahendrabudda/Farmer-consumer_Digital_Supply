import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    // Ensure axios always sends cookies with every request
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    // ── GET AUTH STATE ──
    // Checks if a valid cookie exists on the backend to auto-login the user
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            // No toast here to avoid annoying popups if the user isn't logged in
            console.log("Not authenticated");
        }
    };

    // ── GET USER DATA ──
    // Fetches the profile details of the logged-in user
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ── INITIALIZE APP ──
    useEffect(() => {
        getAuthState();
    }, []);

    return (
        <AppContent.Provider
            value={{
                backendUrl,
                isLoggedin,
                setIsLoggedin,
                userData,
                setUserData,
                getUserData,
            }}
        >
            {props.children}
        </AppContent.Provider>
    );
};