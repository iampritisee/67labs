import React from "react";

export default function ASLTracker() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h3>ASL Interpreter</h3>

      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '1rem', 
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        ASL interpretation and sign language tools coming soon.
      </p>

      <div style={{
        padding: '3rem 2rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '2px dashed var(--border)'
      }}>
        <p style={{ 
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          This feature is under development
        </p>
      </div>
    </div>
  );
}