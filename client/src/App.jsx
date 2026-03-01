import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useContext } from 'react'
import { AppContent } from './Context/AppContext'

// Toastify Imports
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerify from './pages/EmailVerify'
import Intro from './pages/intro'
import Navbar from './components/farmer/FarmerNavbar'
import FarmerHeader from './components/farmer/farmerHeader'
import FarmerDashboard from './components/farmer/farmerDashboard'

const PrivateRoute = ({ children, requiredRole }) => {
  const { isLoggedin, userData } = useContext(AppContent)
  if (!isLoggedin) return <Navigate to="/login" replace />
  if (requiredRole && userData?.role !== requiredRole) {
    return <Navigate to={userData?.role === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard'} replace />
  }
  return children
}

const App = () => {
  return (
    <BrowserRouter>
      {/* ── Toast Configuration ── */}
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Matches your black/green theme
      />

      <Routes>
        <Route path='/'             element={<Intro />} />
        <Route path='/login'        element={<Login />} />
        <Route path='/register'     element={<Register />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/farmerNavbar'       element={<Navbar />} />
        <Route path='/farmerHeader'    element={ <FarmerHeader/>}/>
        <Route path='/farmerDashboard' element={ <FarmerDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App