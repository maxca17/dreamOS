import React, { useState, useEffect } from 'react';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';

// Import your scoped CSS for this page (similar to people.css structure)
import '../css/components/lps.css';

// Import any modals needed
import LPDetailsModal from './LPDetailsModal';
import AddLPModal from './AddLPModal';

const LPs = () => {
  const [activeFund, setActiveFund] = useState('fund1');
  const [lps, setLps] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLP, setSelectedLP] = useState(null);

  // Fetch LPs from Supabase based on which fund is active
  const fetchLPs = async (fundNumber) => {
    try {
      const { data, error } = await supabase
        .from('lps') // Adjust table name if different
        .select('*')
        .eq('fund_number', fundNumber)
        .order('id', { ascending: true });

      if (error) throw error;
      setLps(data || []);
    } catch (err) {
      console.error('Error fetching LPs:', err);
    }
  };

  // Re-fetch whenever activeFund changes
  useEffect(() => {
    const fundNumber = activeFund === 'fund1' ? 1 : 2;
    fetchLPs(fundNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFund]);

  // Details Modal
  const handleOpenDetails = (lp) => {
    setSelectedLP(lp);
    setIsDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setSelectedLP(null);
    setIsDetailsOpen(false);
  };

  // Add Modal
  const handleOpenAdd = () => {
    setIsAddOpen(true);
  };
  const handleCloseAdd = () => {
    setIsAddOpen(false);
  };

  // Refresh LPs after adding a new one
  const handleLPAdded = () => {
    const fundNumber = activeFund === 'fund1' ? 1 : 2;
    fetchLPs(fundNumber);
    setIsAddOpen(false);
  };

  return (
    <div className="lps-page-container">
      {/* Same structure as your People page: top-level container, then Navbar */}
      <NavBar />

      {/* Main content area (like .people-main-content) */}
      <div className="lps-main-content">
        {/* Fund Tabs */}
        <div className="fund-tabs">
          <button
            className={activeFund === 'fund1' ? 'tab active' : 'tab'}
            onClick={() => setActiveFund('fund1')}
          >
            Fund 1
          </button>
          <button
            className={activeFund === 'fund2' ? 'tab active' : 'tab'}
            onClick={() => setActiveFund('fund2')}
          >
            Fund 2
          </button>
        </div>

        {/* Header */}
        <div className="lps-header">
          <h2>
            {activeFund === 'fund1'
              ? 'Limited Partners - Fund 1'
              : 'Limited Partners - Fund 2'}
          </h2>
          <button className="add-lp-btn" onClick={handleOpenAdd}>
            Add LP
          </button>
        </div>

        {/* Table */}
        <div className="lps-table-container">
          <table className="lps-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Contact Phone</th>
                <th>Commitment</th>
              </tr>
            </thead>
            <tbody>
              {lps.map((lp) => (
                <tr
                  key={lp.id}
                  className="lp-row"
                  onClick={() => handleOpenDetails(lp)}
                >
                  <td>{lp.name || 'N/A'}</td>
                  <td>{lp.email || 'N/A'}</td>
                  <td>{lp.phone || 'N/A'}</td>
                  <td>
                    {lp.commitment_amount
                      ? `$${lp.commitment_amount}`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isDetailsOpen && selectedLP && (
        <LPDetailsModal lp={selectedLP} onClose={handleCloseDetails} />
      )}
      {isAddOpen && (
        <AddLPModal
          onClose={handleCloseAdd}
          onLPAdded={handleLPAdded}
          fund={activeFund}
        />
      )}
    </div>
  );
};

export default LPs;
