import React from 'react';

/**
 * A minimal Hero component to confirm that a React application is running.
 * It uses inline styles for simplicity and has no external dependencies.
 */
const Hero = () => {
  // Inline styles to avoid needing a separate CSS file or styled-components
  const heroStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    backgroundColor: '#282c34', // A dark, modern background
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    borderRadius: '16px',
    margin: '2rem',
  };

  const headingStyle = {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)', // Responsive font size
    marginBottom: '1rem',
    color: '#61DAFB', // React's signature blue color
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
  };

  const paragraphStyle = {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', // Responsive font size
    maxWidth: '600px',
    lineHeight: '1.6',
  };

  return (
    <div style={heroStyle}>
      <h1 style={headingStyle}>Your React App is Live!</h1>
      <p style={paragraphStyle}>
        If you can see this hero section, your development environment is set up and running correctly. You can now start building your amazing application.
      </p>
    </div>
  );
};

export default Hero;
