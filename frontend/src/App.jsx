import { useState } from 'react'
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CloudUsage from "./pages/CloudUsage";
import CostLeak from "./pages/CostLeak";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {isLoggedIn && <Header onLogout={handleLogout} />}
        <main className="app-main">
          <Routes>
            <Route path='/' element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path='/login' element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path='/register' element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register onLoginSuccess={handleLoginSuccess} />} />
            <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path='/cloud-usage' element={isLoggedIn ? <CloudUsage /> : <Navigate to="/login" />} />
            <Route path='/cost-leaks' element={isLoggedIn ? <CostLeak /> : <Navigate to="/login" />} />
            <Route path='/reports' element={isLoggedIn ? <Reports /> : <Navigate to="/login" />} />
            <Route path='/alerts' element={isLoggedIn ? <Alerts /> : <Navigate to="/login" />} />
            <Route path='/profile' element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
            <Route path='/admin' element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {isLoggedIn && <Footer />}
      </div>
    </BrowserRouter>
  )
}

export default App