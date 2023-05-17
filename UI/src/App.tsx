import { useState } from 'react'
import Login from './pages/login'
import './App.css'
import Landing from './pages/landing'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import NotFoud from './pages/NotFound'
import Dashboard from './pages/dashboard'
import ForgetPassword from './pages/forgetPassword'
import Audit from './pages/audit'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path='account-access' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='password-recovery' element={<ForgetPassword />} />
        <Route path='audit' element={<Audit />} />
        <Route path='*' element={<NotFoud />} />
      </Route>
    </Routes>
  )
}

export default App
