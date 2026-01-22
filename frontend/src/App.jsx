import { useState } from 'react'
import './App.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CloudUsage from "./pages/CloudUsage";
import CostLeak from "./pages/CostLeak";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/cloud-usage' element={<CloudUsage />} />
          <Route path='/cost-leak' element={<CostLeak />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/alerts' element={<Alerts />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App