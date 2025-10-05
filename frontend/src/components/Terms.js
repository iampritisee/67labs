export default function TermsAndConditions() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '3rem 2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800',
        marginBottom: '0.5rem',
        color: '#0f172a'
      }}>
        Terms and Conditions
      </h1>
      
      <p style={{ 
        color: '#64748b', 
        fontSize: '0.875rem',
        marginBottom: '2rem'
      }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div style={{ 
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <p style={{ 
          fontSize: '0.9375rem',
          color: '#856404',
          margin: 0,
          fontWeight: '500'
        }}>
          By using our voice cloning service, you agree to use this technology responsibly and ethically.
        </p>
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          1. Consent and Ownership
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '0.75rem' }}>
          You must have explicit permission to clone any voice that is not your own. You represent and warrant that:
        </p>
        <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '1.5rem' }}>
          <li>You own the rights to the voice being cloned, OR</li>
          <li>You have obtained written consent from the voice owner, OR</li>
          <li>The voice is your own</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          2. Prohibited Uses
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '0.75rem' }}>
          You agree NOT to use our voice cloning service to:
        </p>
        <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '1.5rem' }}>
          <li>Impersonate others without consent</li>
          <li>Create misleading or deceptive content</li>
          <li>Commit fraud or financial crimes</li>
          <li>Harass, threaten, or harm others</li>
          <li>Create non-consensual intimate content</li>
          <li>Violate any local, state, or federal laws</li>
          <li>Spread misinformation or disinformation</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          3. Ethical Guidelines
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '0.75rem' }}>
          When using cloned voices, you must:
        </p>
        <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '1.5rem' }}>
          <li>Clearly disclose when content is AI-generated</li>
          <li>Respect the dignity and privacy of voice owners</li>
          <li>Use the technology for lawful purposes only</li>
          <li>Take responsibility for all content you create</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          4. Data and Privacy
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7' }}>
          Voice samples you upload are used solely to create your voice model. We do not share, sell, or distribute your voice data to third parties. You retain all rights to your original voice recordings.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          5. Liability and Consequences
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '0.75rem' }}>
          You are solely responsible for how you use cloned voices. We reserve the right to:
        </p>
        <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '1.5rem' }}>
          <li>Suspend or terminate accounts that violate these terms</li>
          <li>Report illegal activity to authorities</li>
          <li>Remove content that violates our policies</li>
          <li>Cooperate with law enforcement investigations</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          6. Disclaimer
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7' }}>
          Our service is provided "as is" without warranties. We are not liable for misuse of the technology or damages resulting from your use of the service.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>
          7. Changes to Terms
        </h2>
        <p style={{ color: '#475569', lineHeight: '1.7' }}>
          We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <div style={{
        borderTop: '2px solid #e2e8f0',
        paddingTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#64748b',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          Questions about these terms? Contact us at support@articulate.com
        </p>
        <button 
          onClick={() => window.close()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}