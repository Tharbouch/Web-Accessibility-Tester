import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/authContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(


  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>

)


