import { useState, useEffect, useRef } from 'react';
import { 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  Repeat, 
  Coins, 
  Briefcase, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Percent, 
  GitBranch, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, activeEnv, setActiveEnv, addToast }) => {
  const [expandedSection, setExpandedSection] = useState({
    trades: true,
    config: true,
    extras: true
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tradeItems = [
    { id: 'fx-outright', label: 'FX Outright', icon: TrendingUp },
    { id: 'fx-swap', label: 'FX Swap', icon: Repeat },
    { id: 'mm', label: 'MM', icon: Coins },
    { id: 'nostro', label: 'Nostro', icon: Briefcase },
    { id: 'free-cash', label: 'Free Cash', icon: DollarSign },
    { id: 'ndf-outright', label: 'NDF Outright', icon: FileText },
    { id: 'ndf-swap', label: 'NDF Swap', icon: RefreshCw },
    { id: 'bond', label: 'Bond', icon: Percent },
  ];

  const configItems = [
    { id: 'mapping', label: 'Mapping', icon: GitBranch },
    { id: 'credit', label: 'Credit', icon: ShieldCheck },
    { id: 'blotter', label: 'Blotter', icon: BookOpen },
  ];

  const extraItems = [
    { id: 'pages', label: 'Pages', icon: Layers },
  ];

  return (
    <aside className="sidebar glass">
      {/* Brand Header */}
      <div className="sidebar__brand" onClick={() => setActiveTab('my-trades')} style={{ cursor: 'pointer' }} title="Go to home (MM Ticket)">
        <div className="sidebar__brand-logo">
          <Wallet size={20} className="brand-logo-icon" />
        </div>
        <span className="sidebar__brand-title">Treasury Ticket</span>
      </div>

      {/* Environment/System Selector Dropdown */}
      <div className="sidebar__env-selector" ref={dropdownRef}>
        <label className="env-label">Active Desk / System</label>
        <div className="env-select-custom">
          <button 
            type="button" 
            className="env-select-trigger" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{activeEnv}</span>
            <ChevronDown size={12} className={`select-chevron ${dropdownOpen ? 'rotated' : ''}`} />
          </button>
          <div className={`env-select-dropdown ${dropdownOpen ? 'env-select-dropdown--open' : ''}`}>
            {['Treasury', 'SMO', 'Totoro', 'Venom', 'GlossPB'].map((env) => (
              <button
                key={env}
                type="button"
                className={`env-dropdown-item ${activeEnv === env ? 'env-dropdown-item--active' : ''}`}
                onClick={() => {
                  setActiveEnv(env);
                  setDropdownOpen(false);
                }}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar__nav">
        {/* Standalone My Trades Button above TRADES */}
        <div className="sidebar__item" style={{ marginBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('my-trades')}
            className={`sidebar__btn ${activeTab === 'my-trades' ? 'sidebar__btn--active' : ''}`}
          >
            <Sparkles size={16} className="sidebar__icon" />
            <span className="sidebar__label">My Trades</span>
          </button>
        </div>

        {/* Trades Section */}
        <div className="sidebar__section">
          <div className="sidebar__section-header" onClick={() => toggleSection('trades')}>
            <span>TRADES</span>
            <ChevronDown size={14} className={`chevron-icon ${expandedSection.trades ? 'rotated' : ''}`} />
          </div>
          {expandedSection.trades && (
            <ul className="sidebar__list">
              {tradeItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="sidebar__item">
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar__btn ${isActive ? 'sidebar__btn--active' : ''}`}
                    >
                      <Icon size={16} className="sidebar__icon" />
                      <span className="sidebar__label">{item.label}</span>
                      {item.badge && <span className="sidebar__badge">{item.badge}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Config Section */}
        <div className="sidebar__section">
          <div className="sidebar__section-header" onClick={() => toggleSection('config')}>
            <span>CONFIG</span>
            <ChevronDown size={14} className={`chevron-icon ${expandedSection.config ? 'rotated' : ''}`} />
          </div>
          {expandedSection.config && (
            <ul className="sidebar__list">
              {configItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="sidebar__item">
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar__btn ${isActive ? 'sidebar__btn--active' : ''}`}
                    >
                      <Icon size={16} className="sidebar__icon" />
                      <span className="sidebar__label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Extras Section */}
        <div className="sidebar__section">
          <div className="sidebar__section-header" onClick={() => toggleSection('extras')}>
            <span>EXTRAS</span>
            <ChevronDown size={14} className={`chevron-icon ${expandedSection.extras ? 'rotated' : ''}`} />
          </div>
          {expandedSection.extras && (
            <ul className="sidebar__list">
              {extraItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="sidebar__item">
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar__btn ${isActive ? 'sidebar__btn--active' : ''}`}
                    >
                      <Icon size={16} className="sidebar__icon" />
                      <span className="sidebar__label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Standalone Support Link */}
        <div className="sidebar__item" style={{ marginTop: '0.5rem' }}>
          <a 
            href="#support" 
            className="sidebar__btn sidebar__btn--support"
            onClick={(e) => {
              e.preventDefault();
              if (addToast) addToast('Connecting to Treasury Support...', 'info');
            }}
          >
            <HelpCircle size={18} className="sidebar__icon" />
            <span className="sidebar__label">Treasury Support</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar__footer">
        <p className="sidebar__copyright">Treasury Ticket © 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
