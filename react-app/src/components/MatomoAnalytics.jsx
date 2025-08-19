import { useEffect, useState } from 'react';

const MatomoAnalytics = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Skip analytics in development mode to prevent console warnings
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('Matomo analytics disabled in development mode');
      return;
    }

    // Initialize Matomo tracking
    const initializeMatomo = () => {
      try {
        // Create the _paq array if it doesn't exist
        window._paq = window._paq || [];
        
        // Basic Matomo configuration
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        
        // Set the tracker URL and site ID
        window._paq.push(['setTrackerUrl', 'https://pippenguin.matomo.cloud/matomo.php']);
        window._paq.push(['setSiteId', '1']); // Replace '1' with your actual site ID if different
        
        // Create and load the Matomo script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://cdn.matomo.cloud/pippenguin.matomo.cloud/matomo.js';
        
        script.onload = () => {
          console.log('Matomo analytics script loaded successfully');
          setScriptLoaded(true);
        };
        
        script.onerror = (error) => {
          console.warn('Matomo analytics script failed to load, this will not affect site functionality', error);
          setScriptError(true);
          // Remove the script to prevent further errors
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
        
        // Add script to document head
        document.head.appendChild(script);
        
        return script;
      } catch (error) {
        console.warn('Error initializing Matomo analytics:', error);
        setScriptError(true);
        return null;
      }
    };

    const script = initializeMatomo();
    
    // Cleanup on unmount
    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Track page views when component updates (for SPA navigation)
  useEffect(() => {
    if (scriptLoaded && window._paq) {
      window._paq.push(['setCustomUrl', window.location.pathname]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [scriptLoaded, window.location.pathname]);

  // This component doesn't render anything
  return null;
};

export default MatomoAnalytics;
