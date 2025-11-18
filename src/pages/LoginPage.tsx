import { useState } from 'react';
import { connectWallet, checkMetaMask } from '../lib/web3';

interface LoginPageProps {
  onLoginSuccess: (address: string) => void;
}

/**
 * LoginPage Component - Modern Web3 Authentication
 * 
 * Teaching Points:
 * 1. MetaMask detection and connection flow
 * 2. Error handling for wallet connection
 * 3. Loading states during connection
 * 4. Authentication pattern with Web3
 */
export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignInWithMetaMask = async () => {
    // Check if MetaMask is available
    if (!checkMetaMask()) {
      setError(
        'MetaMask is not installed. Please install the MetaMask extension to continue.'
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Connect wallet and get address
      const address = await connectWallet();
      // Pass the connected address to parent (App.tsx)
      onLoginSuccess(address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-content">
        {/* Left Section - Branding & Info */}
        <div className="login-section login-left">
          <div className="login-branding">
            <div className="logo-container">
              <span className="logo-icon">🔐</span>
            </div>
            <h1 className="login-brand-title">Web3 Workshop</h1>
            <p className="login-brand-subtitle">Connect to the blockchain</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">💼</span>
              <div>
                <h4>Secure</h4>
                <p>Your private keys stay in MetaMask</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Fast</h4>
                <p>Instant wallet connection</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <div>
                <h4>Decentralized</h4>
                <p>Non-custodial Web3 auth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-section login-right">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Connect your MetaMask wallet to get started</p>
            </div>

            <div className="login-form-body">
              <button
                onClick={handleSignInWithMetaMask}
                disabled={isConnecting}
                className="signin-button-modern"
              >
                {isConnecting ? (
                  <>
                    <span className="button-spinner-modern"></span>
                    <span>Connecting Wallet...</span>
                  </>
                ) : (
                  <>
                    <span className="metamask-icon-large">🦊</span>
                    <span>Sign in with MetaMask</span>
                  </>
                )}
              </button>

              {error && (
                <div className="login-error-modern">
                  <p className="error-icon">⚠️</p>
                  <p className="error-text-modern">{error}</p>
                </div>
              )}

              <div className="login-divider">
                <span>How it works</span>
              </div>

              <div className="login-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Click Connect</h4>
                    <p>Start the connection process</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Approve in MetaMask</h4>
                    <p>Confirm in your wallet</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>You're In!</h4>
                    <p>View your balance and address</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-footer">
              <p className="login-footer-text">
                Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">Install it</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
