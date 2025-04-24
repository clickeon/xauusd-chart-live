import { useEffect } from 'react';

const AhrefsAnalytics = () => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://analytics.ahrefs.com/analytics.js';
    script.dataset.key = 'ujgnt0wqf3/+YdDRI1+THA';
    script.async = true;
    
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
