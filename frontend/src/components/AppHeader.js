import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppHeader() {
  const { logout, user } = useAuth0();

  return (
    <header className="app-header">
      <div className="app-logo">articulate</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {user.name || user.email}
          </span>
        )}
        <button
          className="btn btn-logout"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}