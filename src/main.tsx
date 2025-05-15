import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import ConfirmAction from "./components/button"
// import MainApp from "./components/MainApp";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ConfirmAction />
    {/* <MainApp /> */}
  </StrictMode>
)
