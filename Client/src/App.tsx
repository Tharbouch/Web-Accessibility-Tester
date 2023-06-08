import Login from './pages/login'
import './App.css'
import Landing from './pages/landing'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import NotFoud from './pages/NotFound'
import Dashboard from './pages/dashboard'
import ForgetPassword from './pages/forgetPassword'
import Audit from './pages/audit'
import NewPassword from './pages/newPassword'
import { useEffect } from 'react'
import axios from 'axios'
import { Guidlines } from './pages/guidlines'

function App() {
  // Fetch the CSRF token from the server

  const fetchCsrfToken = async () => {
    const response = (await axios.get(
      "http://localhost:4000/api/generate/csrf-token"
    )).data;
    const data = await response;
    // Set the CSRF token in a cookie named '_csrf'
    document.cookie = `_csrf=${data.csrfToken}`;
  };
  useEffect(() => {
    if (document.cookie === "") {
      fetchCsrfToken();
    }

  }, []);


  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path='account-access' element={<Login />} />
        <Route path='account-recovery' element={<ForgetPassword />} />
        <Route path="password-reset/:id/:token" element={<NewPassword />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='audit/:id' element={<Audit />} />
        <Route path='audit' element={<Audit />} />
        <Route path='guides' element={<Guidlines />} />
        <Route path='*' element={<NotFoud />} />
      </Route>
    </Routes>

  )
}

export default App
