import { useState, useEffect } from 'react';
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

  return (
    <header className={`py-4 transition-all duration-300 ease-in-out ${
      isScrolled ? 'navbar-fixed' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="gold-gradient rounded-md h-8 w-8 flex items-center justify-center">
                <span className="text-white font-bold">XAU</span>
              </span>
              <span className="text-xl font-bold text-navy">XAUUSD <span className="text-gold">Chart Live</span></span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#chart" className="text-navy-light hover:text-gold transition-colors">Charts</a>
            <a href="#signals" className="text-navy-light hover:text-gold transition-colors">Signals</a>
            <a href="#news" className="text-navy-light hover:text-gold transition-colors">News</a>
            <a href="https://lnk.brokerinspect.com/trade-gold" target="_blank" rel="noopener noreferrer" className="text-navy-light hover:text-gold transition-colors">Trade Gold</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="gold" 
              onClick={() => window.open('https://lnk.brokerinspect.com/trade-gold', '_blank')}
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
