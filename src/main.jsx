import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import LoginPage from './Components/Authentication/Login'
import SignUpPage from './Components/Authentication/SignUp'
import TemplatePage from './Components/TemplatePage'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/templates" element={<TemplatePage/>} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
