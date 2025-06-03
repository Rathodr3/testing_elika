
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Phone, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import SearchDialog from './SearchDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Careers', href: '/projects' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const isHomePage = location.pathname === '/';

  const handleContactClick = () => {
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHomePage
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-100/80' 
          : 'bg-white/90 backdrop-blur-md'
      )}>
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-4 group relative z-10">
              <div className="h-14 lg:h-16 transition-all duration-300 group-hover:scale-105">
                <img 
                  src="/lovable-uploads/c165ae58-6d23-491a-a7a2-cd97233eb6f3.png" 
                  alt="Elika Engineering Private Limited"
                  className="h-full w-auto object-contain filter brightness-110"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-16">
              <div className="flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'px-4 py-3 font-medium transition-all duration-300 relative rounded-lg text-base',
                      isActiveRoute(item.href)
                        ? 'text-primary font-semibold bg-primary/5'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800',
                      'transform hover:scale-105 relative group'
                    )}
                  >
                    {item.label}
                    <span className={cn(
                      'absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300',
                      isActiveRoute(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="h-12 w-12 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary transition-all duration-300"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <ThemeToggle />
              
              <Button 
                onClick={handleContactClick}
                className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:from-primary-600 hover:via-purple-700 hover:to-blue-700 text-white px-8 py-3 h-auto font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Phone className="h-4 w-4 mr-2" />
                <span className="relative z-10">Contact Us</span>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="h-11 w-11 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <Search className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <button
                className="h-11 w-11 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-gray-100/80 shadow-xl">
              <div className="container mx-auto px-6 py-8">
                <div className="space-y-2 mb-8">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={cn(
                        'block px-6 py-4 font-medium rounded-xl transition-all duration-300',
                        isActiveRoute(item.href)
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:from-primary-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleContactClick();
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};

export default Header;
