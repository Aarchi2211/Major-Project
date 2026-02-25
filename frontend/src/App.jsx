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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("token", "dummyToken");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
  // Remove token
  localStorage.removeItem("token");

  // Clear any other stored data 
  localStorage.removeItem("user");
  localStorage.removeItem("cloudData");
  localStorage.removeItem("alerts");
  localStorage.removeItem("reports");

  // Update state
  setIsLoggedIn(false);
};

  // 🔐 Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="app-layout">

        {isLoggedIn && <Header onLogout={handleLogout} />}

        <main className="app-main">
          <Routes>

            {/* When site loads → always go to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login Page */}
            <Route
              path="/login"
              element={
                isLoggedIn
                  ? <Navigate to="/cloud-usage" replace />
                  : <Login onLoginSuccess={handleLoginSuccess} />
              }
            />

            {/* Register Page */}
            <Route
              path="/register"
              element={
                isLoggedIn
                  ? <Navigate to="/cloud-usage" replace />
                  : <Register onLoginSuccess={handleLoginSuccess} />
              }
            />

            {/* Protected Pages */}
            <Route
              path="/cloud-usage"
              element={
                <ProtectedRoute>
                  <CloudUsage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cost-leaks"
              element={
                <ProtectedRoute>
                  <CostLeak />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>

        {isLoggedIn && <Footer />}

      </div>
    </BrowserRouter>
  )
}

export default App;