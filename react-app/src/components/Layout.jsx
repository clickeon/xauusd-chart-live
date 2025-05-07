import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AhrefsAnalytics from './AhrefsAnalytics';
import SEOLinks from './SEOLinks';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-navy">
      <AhrefsAnalytics />
      <SEOLinks />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout; 