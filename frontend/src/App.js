import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "./components/Dashboard";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Terms from "./components/Terms";
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

  return (
    <Router>
      <Routes>
        {/* Terms page - accessible without login */}
        <Route path="/terms" element={<Terms />} />

        {/* Main app routes */}
        <Route path="/*" element={
          <>
            {!isAuthenticated ? (
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

                <div className="login-page">
                  <div className="login-container">
                    {/* Logo/Brand */}
                    <div className="login-logo">
                      <h1 className="brand-name">articulate</h1>
                      <div className="brand-tagline">Voice AI Technology</div>
                    </div>

                    {/* Headline */}
                    <h2 className="login-headline">
                      Welcome Back
                    </h2>

                    {/* Subheadline */}
                    <p className="login-subheadline">
                      Sign in to access your voice AI suite and start creating
                    </p>

                    {/* CTA Button */}
                    <LoginButton />

                    {/* Divider */}
                    <div className="login-divider">
                      <span>Powered by cutting-edge AI</span>
                    </div>

                    {/* Features */}
                    <div className="login-features-grid">
                      <div className="feature-card">
                        <div className="feature-icon-large">🎙️</div>
                        <div className="feature-title">Voice Clone</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-large">💬</div>
                        <div className="feature-title">Text to Speech</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-large">👋</div>
                        <div className="feature-title">ASL Tools</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-large">👁️</div>
                        <div className="feature-title">Eye Gaze</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
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
                  <div className="app-logo">articulate</div>
                  <LogoutButton />
                </header>
                <Dashboard />
              </>
            )}
          </>
        } />
      </Routes>
    </Router>
  );
}