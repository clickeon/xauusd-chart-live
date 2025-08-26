import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener to apply fixed navbar when scrolled.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section handler
  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`py-4 transition-all duration-300 ease-in-out ${
      isScrolled ? 'navbar-fixed' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2" title="XAUUSD Chart Live Home">
              <span className="gold-gradient rounded-md h-8 w-8 flex items-center justify-center">
                <span className="text-white font-bold">XAU</span>
              </span>
              <span className="text-xl font-bold text-navy">XAUUSD <span className="text-gold">Chart Live</span></span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-navy-light hover:text-gold transition-colors" title="Gold Price Home">Home</Link>
            <Link to="/#hero" className="text-navy-light hover:text-gold transition-colors" title="Gold Price">Gold Price</Link>
            <Link to="/#chart" className="text-navy-light hover:text-gold transition-colors" title="Live Gold Charts">Gold Charts</Link>
            <Link to="/#signals" className="text-navy-light hover:text-gold transition-colors" title="Gold Trading Signals">Trading Signals</Link>
            <Link to="/#news" className="text-navy-light hover:text-gold transition-colors" title="Gold Market News">Gold News</Link>
            <Link to="/#analysis" className="text-navy-light hover:text-gold transition-colors" title="Gold Market Analysis">Market Analysis</Link>
            <a href="https://lnk.broker-inspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="text-navy-light hover:text-gold transition-colors" title="Trade Gold Online">Trade Gold</a>
            <Link to="/about-us" className="text-navy-light hover:text-gold transition-colors" title="About XAUUSD Chart Live">About Us</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="gold" 
              onClick={() => window.open('https://lnk.broker-inspect.com/trade-gold', '_blank')}
            >
              Trade Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
