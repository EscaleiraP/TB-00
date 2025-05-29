import React, { useState, useEffect } from 'react';

const PasswordProtect = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // The correct password - in a real app, this would be stored server-side
  const correctPassword = 'symbiosis-vault-2023';
  
  // Check if user was previously authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('vault_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('vault_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] px-4">
      <div className="bg-[#16213e] rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <svg 
            className="h-16 w-16 text-[#e94560] mb-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h1 className="text-2xl font-bold text-white">Symbiosis Vault</h1>
          <p className="text-gray-400 mt-1 text-center">
            This area is password protected. Please enter the password to continue.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            Access Vault
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Symbiosis Vault. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtect; 