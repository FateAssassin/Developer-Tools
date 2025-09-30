import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CookiesProvider } from 'react-cookie';
import { AlertProvider } from './context/AlertContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <ThemeProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </ThemeProvider>
    </CookiesProvider>
  </StrictMode>
)
