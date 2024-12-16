// import ForgetPassword from './pages/forgetPassword'
// import NewPassword from './pages/newPassword'
import Login from './pages/login'
import Landing from './pages/landing'
import Layout from './components/layout'
import NotFoud from './pages/NotFound'
import Dashboard from './pages/dashboard'
import Guidlines  from './pages/guidlines'
import Audit from './pages/audit'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import fetchCsrfToken from './utils/fetchCRSF'
import './App.css'
function App() {
  
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
        {/* <Route path='password-recovery' element={<ForgetPassword />} /> */}
        {/* <Route path="password-reset/:token" element={<NewPassword />} /> */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='audit' element={<Audit />} />
        <Route path='guides' element={<Guidlines />} />
        <Route path='*' element={<NotFoud />} />
      </Route>
    </Routes>
  )
}

export default App
