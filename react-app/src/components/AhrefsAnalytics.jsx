import { useEffect, useState } from 'react';

const AhrefsAnalytics = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
// test
  useEffect(() => {
    // Skip analytics in development mode to prevent console warnings
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      // Don't load analytics in development mode
      console.log('Analytics disabled in development mode');
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://analytics.ahrefs.com/analytics.js';
    script.dataset.key = 'ujgnt0wqf3/+YdDRI1+THA';
    script.async = true;
    
    // Add event listeners for load and error
    script.onload = () => {
      console.log('Analytics script loaded successfully');
      setScriptLoaded(true);
    };
    
    script.onerror = (error) => {
      console.warn('Analytics script failed to load, this will not affect site functionality', error);
      setScriptError(true);
      // Remove the script to prevent further errors
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
    
    // Add script to document
    document.head.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default AhrefsAnalytics;
