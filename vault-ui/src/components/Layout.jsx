import React, { useState } from 'react';

/**
 * Layout Component
 * Provides a consistent layout with header and footer
 */
const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a2e]">
      {/* Header */}
      <header className="bg-[#16213e] shadow-md border-b border-[#0f3460]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <svg 
                className="h-8 w-8 text-[#e94560]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">VaultCert</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-white hover:text-[#e94560] transition-colors">
                Dashboard
              </a>
              <a href="/certificates" className="text-white hover:text-[#e94560] transition-colors">
                Certificates
              </a>
              <a href="/create" className="text-white hover:text-[#e94560] transition-colors">
                Create New
              </a>
              <a href="/verify" className="text-white hover:text-[#e94560] transition-colors">
                Verify
              </a>
              <button className="btn btn-primary">
                Connect Wallet
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-[#0f3460]">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="/" 
                    className="block text-white hover:text-[#e94560] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a 
                    href="/certificates" 
                    className="block text-white hover:text-[#e94560] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Certificates
                  </a>
                </li>
                <li>
                  <a 
                    href="/create" 
                    className="block text-white hover:text-[#e94560] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create New
                  </a>
                </li>
                <li>
                  <a 
                    href="/verify" 
                    className="block text-white hover:text-[#e94560] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verify
                  </a>
                </li>
                <li>
                  <button 
                    className="btn btn-primary w-full mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connect Wallet
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#16213e] border-t border-[#0f3460] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <svg 
                  className="h-6 w-6 text-[#e94560]" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span className="ml-2 text-lg font-bold text-white">VaultCert</span>
              </div>
              <p className="text-gray-400 text-sm mt-2 text-center md:text-left">
                Securely create, store, and verify certificates using blockchain technology.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="text-white font-medium text-center md:text-right">Quick Links</h3>
              <div className="flex space-x-4 justify-center md:justify-end">
                <a href="/about" className="text-gray-400 hover:text-[#e94560] text-sm transition-colors">
                  About
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-[#e94560] text-sm transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-[#e94560] text-sm transition-colors">
                  Terms
                </a>
                <a href="/contact" className="text-gray-400 hover:text-[#e94560] text-sm transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#0f3460] text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} VaultCert. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 