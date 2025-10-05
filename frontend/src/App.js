import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./components/Dashboard";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import "./index.css";

export default function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="btn-loading" style={{ width: 40, height: 40 }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <h1 className="gradient-text">6-7 Labs</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Please log in to access the voice suite
        </p>
        <LoginButton />
      </div>
    );
  }

  return (
    <>
      {/* Lava Lamp Background */}
      <div className="lava-lamp-bg">
        <div className="lava-blob"></div>
        <div className="lava-blob"></div>
        <div className="lava-blob"></div>
        <div className="lava-blob"></div>
        <div className="lava-blob"></div>
        <div className="lava-blob"></div>
      </div>
      
      <header className="app-header">
        <div className="app-logo">6-7 Labs</div>
        <LogoutButton />
      </header>
      <Dashboard />
    </>
  );
}