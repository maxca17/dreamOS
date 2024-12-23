import React, { useState, useEffect } from 'react';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient'; // Adjust import path as necessary
import '../css/components/PortfolioStats.css';              // Import the new CSS below

function PortfolioStats() {
  const [selectedFund, setSelectedFund] = useState('fundI');

  // ----- Fund I States -----
  const [fundIInvestedAmount, setFundIInvestedAmount] = useState(0);
  const [fundITotalCompanies, setFundITotalCompanies] = useState(0);

  // ----- Fund II States -----
  const [fundIIInvestedAmount, setFundIIInvestedAmount] = useState(0);
  const [fundIITotalCompanies, setFundIITotalCompanies] = useState(0);

  useEffect(() => {
    // Fetch Fund I
    const fetchFundI = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('equity_investments')
        .eq('status', 'Portfolio Company')
        .eq('fund', 'Fund I'); // Adjust if your DB uses different naming

      if (error) {
        console.error('Error fetching Fund I data:', error);
        return;
      }

      setFundITotalCompanies(data.length);
      const totalInvested = data.reduce((acc, company) => {
        const investments = company.equity_investments || [];
        return acc + investments.reduce((sum, inv) => {
          return sum + (parseFloat(inv.invested_amount) || 0);
        }, 0);
      }, 0);
      setFundIInvestedAmount(totalInvested);
    };

    // Fetch Fund II
    const fetchFundII = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('equity_investments')
        .eq('status', 'Portfolio Company')
        .eq('fund', 'Fund II'); // Adjust if your DB uses different naming

      if (error) {
        console.error('Error fetching Fund II data:', error);
        return;
      }

      setFundIITotalCompanies(data.length);
      const totalInvested = data.reduce((acc, company) => {
        const investments = company.equity_investments || [];
        return acc + investments.reduce((sum, inv) => {
          return sum + (parseFloat(inv.invested_amount) || 0);
        }, 0);
      }, 0);
      setFundIIInvestedAmount(totalInvested);
    };

    fetchFundI();
    fetchFundII();
  }, []);

  // Render Fund I stats
  const renderFundIStats = () => {
    return (
      <div className="stats-section">
        <h2>Fund I Stats</h2>
        <p>Total Invested: {fundIInvestedAmount.toFixed(2)}</p>
        <p>Total Portfolio Companies: {fundITotalCompanies}</p>
      </div>
    );
  };

  // Render Fund II stats
  const renderFundIIStats = () => {
    return (
      <div className="stats-section">
        <h2>Fund II Stats</h2>
        <p>Total Invested: {fundIIInvestedAmount.toFixed(2)}</p>
        <p>Total Portfolio Companies: {fundIITotalCompanies}</p>
      </div>
    );
  };

  return (
    <div className="portfolio-stats-wrapper">
      {/* Keep your existing NavBar exactly as it is */}
      <NavBar />

      {/* Main content area to the right of the NavBar */}
      <div className="portfolio-stats-content">
        <h1 className="page-title">Portfolio Stats</h1>

        {/* Tabs for switching Fund I / Fund II */}
        <div className="tabs-container">
          <button
            className={`tab-button ${selectedFund === 'fundI' ? 'active' : ''}`}
            onClick={() => setSelectedFund('fundI')}
          >
            Fund I
          </button>
          <button
            className={`tab-button ${selectedFund === 'fundII' ? 'active' : ''}`}
            onClick={() => setSelectedFund('fundII')}
          >
            Fund II
          </button>
        </div>

        {/* Tab content area */}
        <div className="tab-content">
          {selectedFund === 'fundI' && renderFundIStats()}
          {selectedFund === 'fundII' && renderFundIIStats()}
        </div>
      </div>
    </div>
  );
}

export default PortfolioStats;
