import { useEffect } from 'react';

export const useCanonical = (canonicalUrl) => {
  useEffect(() => {
    // Remove any existing canonical links
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(link => link.remove());

    // Create and add the new canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    document.head.appendChild(canonicalLink);

    // Debug logging
    console.log(`Canonical URL set to: ${canonicalUrl}`);

    // Cleanup function to remove the canonical link when component unmounts
    return () => {
      const currentCanonical = document.querySelector(`link[rel="canonical"][href="${canonicalUrl}"]`);
      if (currentCanonical) {
        currentCanonical.remove();
      }
    };
  }, [canonicalUrl]);
}; 