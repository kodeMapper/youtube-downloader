"use client";

import { useEffect, useState } from "react";

// Simple test component to check if the basic rendering is working
export default function TestPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading state for 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a1a, #000)',
      color: 'white',
      padding: '2rem'
    }}>
      {isLoading ? (
        <div>
          <div style={{ 
            border: '4px solid rgba(255, 255, 255, 0.1)', 
            borderTopColor: '#3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Loading YouTube Downloader...</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>YouTube Downloader Test</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>This is a basic test page to verify that rendering works</p>
          
          <div style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Status Check</h2>
            <ul style={{ textAlign: 'left', listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', color: '#4ade80' }}>✅ React components rendering</li>
              <li style={{ marginBottom: '0.5rem', color: '#4ade80' }}>✅ State management working</li>
              <li style={{ marginBottom: '0.5rem', color: '#4ade80' }}>✅ useEffect hooks functioning</li>
              <li style={{ marginBottom: '0.5rem', color: '#4ade80' }}>✅ Basic styling applied</li>
            </ul>
          </div>
          
          <p>If you can see this page, the basic Next.js app is working correctly.</p>
        </div>
      )}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
