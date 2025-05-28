const fs = require('fs');
const path = require('path');

// Read the built index.html file
const distPath = path.join(__dirname, '../react-app/dist');
const indexPath = path.join(distPath, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Define routes and their canonical URLs
const routes = [
  {
    path: 'about-us',
    canonicalUrl: 'https://xauusd-chart-live.com/about-us',
    title: 'About Us - XAUUSD Chart Live | Gold Price Experts',
    description: 'Learn about XAUUSD Chart Live - your trusted source for real-time gold price tracking, advanced charting, and expert market insights. Our mission and team.',
    ogTitle: 'About Us - XAUUSD Chart Live | Gold Price Experts',
    ogDescription: 'Learn about XAUUSD Chart Live - your trusted source for real-time gold price tracking and expert market insights.'
  },
  {
    path: 'disclaimer', 
    canonicalUrl: 'https://xauusd-chart-live.com/disclaimer',
    title: 'Legal Disclaimer - XAUUSD Chart Live | Risk Warning',
    description: 'Read our legal disclaimer and risk warning. Trading gold involves substantial risk. Important legal information for XAUUSD Chart Live users.',
    ogTitle: 'Legal Disclaimer - XAUUSD Chart Live | Risk Warning',
    ogDescription: 'Read our legal disclaimer and risk warning. Trading gold involves substantial risk.'
  },
  {
    path: 'privacy-policy',
    canonicalUrl: 'https://xauusd-chart-live.com/privacy-policy', 
    title: 'Privacy Policy - XAUUSD Chart Live | Data Protection',
    description: 'Our Privacy Policy explains how XAUUSD Chart Live collects, uses, and protects your information. Learn about your data rights and our security measures.',
    ogTitle: 'Privacy Policy - XAUUSD Chart Live | Data Protection',
    ogDescription: 'Our Privacy Policy explains how XAUUSD Chart Live collects, uses, and protects your information.'
  },
  {
    path: 'terms-of-service',
    canonicalUrl: 'https://xauusd-chart-live.com/terms-of-service',
    title: 'Terms of Service - XAUUSD Chart Live | User Agreement', 
    description: 'Read our Terms of Service and user agreement. Important legal terms and conditions for using XAUUSD Chart Live gold price tracking platform.',
    ogTitle: 'Terms of Service - XAUUSD Chart Live | User Agreement',
    ogDescription: 'Read our Terms of Service and user agreement. Important legal terms and conditions for using XAUUSD Chart Live.'
  }
];

// Function to inject canonical URL and update meta tags
function injectCanonicalAndMeta(html, route) {
  // Add canonical URL to head
  const canonicalTag = `<link rel="canonical" href="${route.canonicalUrl}" />`;
  
  // Add a meta tag to signal this is a static page (for debugging)
  const staticPageTag = `<meta name="static-page" content="${route.path}" />`;
  
  // Update title
  let updatedHtml = html.replace(
    /<title>.*?<\/title>/,
    `<title>${route.title}</title>`
  );
  
  // Update description
  updatedHtml = updatedHtml.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Update Open Graph title
  updatedHtml = updatedHtml.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${route.ogTitle}" />`
  );

  // Update Open Graph description
  updatedHtml = updatedHtml.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${route.ogDescription}" />`
  );

  // Update Open Graph URL to match canonical
  updatedHtml = updatedHtml.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${route.canonicalUrl}" />`
  );

  // Update Twitter title
  updatedHtml = updatedHtml.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${route.ogTitle}" />`
  );

  // Update Twitter description
  updatedHtml = updatedHtml.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${route.ogDescription}" />`
  );

  // Update Schema.org URL
  updatedHtml = updatedHtml.replace(
    /"url": "https:\/\/xauusd-chart-live\.com"/,
    `"url": "${route.canonicalUrl}"`
  );
  
  // Insert canonical URL and static page marker before the closing head tag
  updatedHtml = updatedHtml.replace(
    '</head>',
    `  ${canonicalTag}\n  ${staticPageTag}\n</head>`
  );
  
  return updatedHtml;
}

// Generate HTML files for each route
routes.forEach(route => {
  const routeHtml = injectCanonicalAndMeta(indexHtml, route);
  const routeFilePath = path.join(distPath, `${route.path}.html`);
  
  fs.writeFileSync(routeFilePath, routeHtml);
  console.log(`Generated ${route.path}.html with canonical URL: ${route.canonicalUrl}`);
});

// Also add canonical URL to main index.html
const homeCanonical = 'https://xauusd-chart-live.com/';
const homeHtml = indexHtml.replace(
  '</head>',
  `  <link rel="canonical" href="${homeCanonical}" />\n  <meta name="static-page" content="home" />\n</head>`
);

fs.writeFileSync(indexPath, homeHtml);
console.log(`Updated index.html with canonical URL: ${homeCanonical}`);

console.log('Post-build processing completed successfully!'); 