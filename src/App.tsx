import { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

/**
 * App Component - Main Router
 * 
 * Teaching Points:
 * 1. Simple page routing without libraries
 * 2. State management for authentication
 * 3. Session persistence with localStorage
 * 4. Conditional rendering based on auth state
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  /**
   * Check if user has a saved session on component mount
   */
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setUserAddress(savedAddress);
      setIsLoggedIn(true);
    }
  }, []);

  /**
   * Handle successful login
   * Save address to localStorage and update state
   */
  const handleLoginSuccess = (address: string) => {
    setUserAddress(address);
    setIsLoggedIn(true);
    localStorage.setItem('userAddress', address);
  };

  /**
   * Handle logout
   * Clear session and return to login page
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserAddress(null);
    localStorage.removeItem('userAddress');
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : userAddress ? (
        <HomePage address={userAddress} onLogout={handleLogout} />
      ) : null}
    </>
  );
}

export default App;
