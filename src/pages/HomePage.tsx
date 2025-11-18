import { useState, useEffect } from 'react';
import { getBalance, formatAddress, getUSDCBalance } from '../lib/web3';

interface HomePageProps {
  address: string;
  onLogout: () => void;
}

/**
 * HomePage Component - Modern Dashboard
 * 
 * Teaching Points:
 * 1. Displaying wallet information
 * 2. Fetching and displaying balance
 * 3. Loading and error states
 * 4. Session management with logout
 */
export default function HomePage({ address, onLogout }: HomePageProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usdcError, setUsdcError] = useState<string | null>(null);

  /**
   * Fetch balance when component mounts
   */
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoadingBalance(true);
      setError(null);

      try {
        const ethBalance = await getBalance(address);
        setBalance(ethBalance);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        setError(errorMessage);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [address]);

  /**
   * Fetch Bitcoin price when component mounts
   */
  useEffect(() => {
    const fetchUSDCBalance = async () => {
      setIsLoadingUsdc(true);
      setUsdcError(null);

      try {
        const balance = await getUSDCBalance(address);
        setUsdcBalance(balance);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch USDC balance';
        setUsdcError(errorMessage);
      } finally {
        setIsLoadingUsdc(false);
      }
    };

    fetchUSDCBalance();
  }, [address]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const handleEtherscanLink = () => {
    window.open(`https://etherscan.io/address/${address}`, '_blank');
  };

  return (
    <div className="home-wrapper">
      {/* Top Navigation */}
      <div className="home-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="navbar-icon">🔐</span>
            <span className="navbar-title">Web3 Workshop</span>
          </div>
          <button onClick={onLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-main">
        {/* Welcome Card */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome Back! 👋</h1>
            <p className="welcome-subtitle">Here's your wallet information</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Balance Card */}
          <div className="card balance-card">
            <div className="card-header">
              <h3 className="card-title">ETH Balance</h3>
              <span className="card-icon">💰</span>
            </div>
            <div className="card-body">
              {isLoadingBalance ? (
                <div className="balance-skeleton">
                  <div className="skeleton"></div>
                </div>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : balance !== null ? (
                <>
                  <p className="balance-amount">{balance}</p>
                  <p className="balance-label">ETH</p>
                </>
              ) : null}
            </div>
          </div>

          {/* USDC Balance Card */}
          <div className="card usdc-card">
            <div className="card-header">
              <h3 className="card-title">USDC Balance</h3>
              <span className="card-icon">💵</span>
            </div>
            <div className="card-body">
              {isLoadingUsdc ? (
                <div className="balance-skeleton">
                  <div className="skeleton"></div>
                </div>
              ) : usdcError ? (
                <p className="error-message">{usdcError}</p>
              ) : usdcBalance !== null ? (
                <>
                  <p className="balance-amount usdc-amount">{usdcBalance}</p>
                  <p className="balance-label">USDC</p>
                </>
              ) : null}
            </div>
          </div>

          {/* Address Card */}
          <div className="card address-card">
            <div className="card-header">
              <h3 className="card-title">Wallet Address</h3>
              <span className="card-icon">📍</span>
            </div>
            <div className="card-body">
              <div className="address-display-modern">
                <p className="address-short">{formatAddress(address)}</p>
                <button
                  onClick={handleCopyAddress}
                  className="copy-button-modern"
                  title="Copy full address"
                >
                  📋
                </button>
              </div>
              <p className="address-full">{address}</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card actions-card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <span className="card-icon">⚡</span>
            </div>
            <div className="card-body actions-list">
              <button
                onClick={handleEtherscanLink}
                className="action-link"
              >
                <span className="action-icon">🔗</span>
                <div className="action-text">
                  <p className="action-name">View on Etherscan</p>
                  <p className="action-desc">See all transactions</p>
                </div>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="action-link"
              >
                <span className="action-icon">🔄</span>
                <div className="action-text">
                  <p className="action-name">Refresh Balance</p>
                  <p className="action-desc">Update balance data</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h2 className="info-title">About Your Dashboard</h2>
          <div className="info-grid">
            <div className="info-card">
              <h4>🔒 Security</h4>
              <p>Your private keys remain secure in MetaMask. We never store your credentials.</p>
            </div>
            <div className="info-card">
              <h4>📊 Real-Time Data</h4>
              <p>Balance and address information is fetched directly from the blockchain.</p>
            </div>
            <div className="info-card">
              <h4>🌐 Decentralized</h4>
              <p>This dashboard uses ethers.js to interact with Ethereum via MetaMask's RPC.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
