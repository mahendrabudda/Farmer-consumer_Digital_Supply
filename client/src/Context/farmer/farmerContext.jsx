import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AppContent } from "../AppContext";

export const FarmerContent = createContext();

export const FarmerContextProvider = ({ children }) => {
    const { backendUrl } = useContext(AppContent);

    const [farmerData, setFarmerData] = useState(null);
    const [farmerLoading, setFarmerLoading] = useState(false);

    // ── GET farmer dashboard from backend ──
    const getFarmerData = async () => {
        setFarmerLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/farmer/dashboard`);
            if (data.success) {
                setFarmerData(data.dashboard);
            }
        } catch (error) {
            console.log("Could not fetch farmer data:", error.message);
        } finally {
            setFarmerLoading(false);
        }
    };

    // ── REFRESH farmer data (call after update) ──
    const refreshFarmerData = async () => {
        await getFarmerData();
    };

    // ── CLEAR farmer data (on logout) ──
    const clearFarmerData = () => {
        setFarmerData(null);
    };

    return (
        <FarmerContent.Provider value={{
            farmerData, setFarmerData,
            farmerLoading,
            getFarmerData,
            refreshFarmerData,
            clearFarmerData,
        }}>
            {children}
        </FarmerContent.Provider>
    );
};