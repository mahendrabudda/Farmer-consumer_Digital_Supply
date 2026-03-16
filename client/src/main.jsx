import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./Context/AppContext.jsx";
import { FarmerContextProvider } from "./Context/farmer/farmerContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <FarmerContextProvider>
        <App />
      </FarmerContextProvider>
    </AppContextProvider>
  </StrictMode>
)