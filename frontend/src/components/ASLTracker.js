import React from "react";

export default function ASLTracker() {
  const displayVoiceName = "Cheryl";
  const displayVoiceIcon = "🎤";

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <h3>ASL Interpreter</h3>
      
      {/* Voice Name Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.25rem',
        background: '#f1f5f9',
        color: '#0f172a',
        fontSize: '0.875rem',
        fontWeight: '600',
        borderRadius: '20px',
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <span style={{ fontSize: '1.125rem' }}>{displayVoiceIcon}</span>
        <span>{displayVoiceName}</span>
      </div>

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