import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'react-tooltip/dist/react-tooltip.css'
import { AuthProvider } from './context/AuthProvider.tsx'
import { LoadingProvider } from './context/LoadingProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </React.StrictMode>,
)
