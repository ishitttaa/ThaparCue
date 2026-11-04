import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import './theme.css' //new columns override purane columns
import './morphism.css'
import App from './App.jsx'
import BackgroundFX from './components/layout/BackgroundFX'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BackgroundFX />
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)