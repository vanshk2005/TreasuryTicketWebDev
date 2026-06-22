import { useEffect, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';

/* Core components */
import Preloader from './components/Preloader/Preloader';
import Background from './components/Background/Background';
import Sidebar from './components/Sidebar/Sidebar';
import MMTicket from './components/MM/MMTicket';
import FXOutrightTicket from './components/FXOutright/FXOutrightTicket';
import FXSwapTicket from './components/FXSwap/FXSwapTicket';
import NostroTicket from './components/Nostro/NostroTicket';
import FreeCashTicket from './components/FreeCash/FreeCashTicket';
import NDFOutrightTicket from './components/NDFOutright/NDFOutrightTicket';
import NDFSwapTicket from './components/NDFSwap/NDFSwapTicket';
import Toast from './components/Toast/Toast';
import MyTrades from './components/MyTrades/MyTrades';

import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mm');
  const [activeSubTab, setActiveSubTab] = useState('home');

  // Hoisted global configuration toggles
  const [mirrorTrades, setMirrorTrades] = useState(false);
  const [disableOffMkt, setDisableOffMkt] = useState(false);

  // Hoisted active desk/system environment
  const [activeEnv, setActiveEnv] = useState('Treasury');

  // Hoisted toast notifications list
  const [toasts, setToasts] = useState([]);

  const handleEnvChange = (newEnv) => {
    setActiveEnv(newEnv);
    addToast(`Switched active desk/system to: ${newEnv}`, 'info');
  };

  const handleOperationClick = (opName) => {
    const event = new CustomEvent('trade-operation', { detail: { operation: opName } });
    window.dispatchEvent(event);
  };

  /* Lock scroll during preloader loading state */
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  /* Disable browser automatic scroll restoration and force scroll to top on mount */
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handlePreloaderTransitionStart = () => {
    window.scrollTo(0, 0);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    window.scrollTo(0, 0);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Convert tab ID to display name
  const getDisplayTabName = () => {
    return activeTab.toUpperCase().replace('-', ' ');
  };

  // Render sub-page content
  const renderContent = () => {
    if (activeTab === 'mm') {
      return (
        <MMTicket 
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'fx-outright') {
      return (
        <FXOutrightTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'fx-swap') {
      return (
        <FXSwapTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'nostro') {
      return (
        <NostroTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'free-cash') {
      return (
        <FreeCashTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'ndf-outright') {
      return (
        <NDFOutrightTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'ndf-swap') {
      return (
        <NDFSwapTicket 
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    // For other tabs that haven't been shared yet, we can render the dynamic locked MMTicket for now
    const isTradeForm = [
      'bond'
    ].includes(activeTab);

    if (isTradeForm) {
      return (
        <MMTicket 
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          mirrorTrades={mirrorTrades}
          disableOffMkt={disableOffMkt}
          addToast={addToast}
        />
      );
    }

    if (activeTab === 'my-trades') {
      return (
        <MyTrades 
          addToast={addToast}
        />
      );
    }

    // Config & Extras modules render dynamic system logs
    return (
      <div className="workspace-placeholder">
        <div className="placeholder-card glass">
          <div className="pulse-dot"></div>
          <h2>{getDisplayTabName()} Console</h2>
          <p className="subtitle">System path: <code>admin/{activeTab}</code></p>
          <div className="placeholder-details">
            <p>
              The <strong>{getDisplayTabName()}</strong> dashboard is undergoing validation checks against the primary clearing broker ledger.
            </p>
            <p className="mt-2 text-muted">
              Select one of the **Trades** sections in the left sidebar to enter deal tickets for {getDisplayTabName()}.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Animated background */}
      <Background />

      {/* Preloader */}
      {isLoading && (
        <Preloader
          onComplete={handlePreloaderComplete}
          onTransitionStart={handlePreloaderTransitionStart}
        />
      )}

      {/* Toast Notifications */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <Toast 
            key={t.id} 
            message={t.message} 
            type={t.type} 
            onClose={() => removeToast(t.id)} 
          />
        ))}
      </div>

      {/* Main Content Layout */}
      {!isLoading && (
        <main className="app__main">
          {/* Left Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            activeEnv={activeEnv}
            setActiveEnv={handleEnvChange}
            addToast={addToast}
          />
          
          {/* Right Workspace Wrapper */}
          <div className="workspace">
            {/* Hoisted Top Navigation Bar */}
            <header className="workspace__header glass--subtle">
              <div className="workspace__header-left">
                <button 
                  onClick={() => setActiveSubTab('home')}
                  className={`subtab-btn ${activeSubTab === 'home' ? 'subtab-btn--active' : ''}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setActiveSubTab('preferences')}
                  className={`subtab-btn ${activeSubTab === 'preferences' ? 'subtab-btn--active' : ''}`}
                >
                  Preferences
                </button>
              </div>

              <div className="workspace__header-right">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={mirrorTrades} 
                    onChange={(e) => {
                      setMirrorTrades(e.target.checked);
                      addToast(`Mirror Trades ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
                    }} 
                  />
                  <div className="checkbox-box"></div>
                  <span>Mirror Trades</span>
                </label>

                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={disableOffMkt} 
                    onChange={(e) => {
                      setDisableOffMkt(e.target.checked);
                      addToast(`Off Market Checks ${e.target.checked ? 'Disabled' : 'Enabled'}`, 'warning');
                    }} 
                  />
                  <div className="checkbox-box"></div>
                  <span>Disable Off Mkt Checks</span>
                </label>
              </div>
            </header>

            {/* Scrollable Workspace Content with transition animations */}
            <div className="workspace__content">
              <div 
                key={`${activeTab}-${activeSubTab}`} 
                className="page-transition-enter"
              >
                {renderContent()}
              </div>
            </div>

            {/* Hoisted Fixed Bottom Footer */}
            <footer className="workspace__footer glass--subtle">
              <div className="operations-bar">
                <span className="operations-label">Operations</span>
                <div className="operations-content">
                  <div className="operations-left">
                    <button type="button" onClick={() => handleOperationClick('Commit')} className="op-btn op-btn--primary">Commit</button>
                    <button type="button" onClick={() => handleOperationClick('LoadExcel')} className="op-btn">LoadExcel</button>
                    <button type="button" onClick={() => handleOperationClick('Clone')} className="op-btn">Clone</button>
                    <button type="button" onClick={() => handleOperationClick('Save')} className="op-btn">Save</button>
                    <button type="button" onClick={() => handleOperationClick('Undo')} className="op-btn">Undo</button>
                  </div>
                  <div className="operations-right">
                    <button type="button" onClick={() => handleOperationClick('Cancel')} className="op-btn">Cancel</button>
                    <button type="button" onClick={() => handleOperationClick('Delete')} className="op-btn op-btn--bearish">Delete</button>
                    <button type="button" onClick={() => handleOperationClick('Clear')} className="op-btn">Clear</button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
