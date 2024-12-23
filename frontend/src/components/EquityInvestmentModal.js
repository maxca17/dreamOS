import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/equityopsmodal.css'; // We'll define this CSS below

const EquityInvestmentsModal = ({ companyName, onClose }) => {
  const [investments, setInvestments] = useState([]);
  const [roundType, setRoundType] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [valuation, setValuation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInvestments = useCallback(async () => {
    if (!companyName) return;
    const { data, error } = await supabase
      .from('companies')
      .select('equity_investments')
      .eq('company_name', companyName)
      .single();

    if (error) {
      console.error('Error fetching equity investments:', error);
      return;
    }

    setInvestments(Array.isArray(data?.equity_investments) ? data.equity_investments : []);
  }, [companyName]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleAddInvestment = async () => {
    if (!roundType || !investedAmount || !valuation) return;
    setLoading(true);

    const newInvestment = {
      id: `${Date.now()}`,
      round_type: roundType,
      invested_amount: investedAmount,
      valuation: valuation,
      date_added: new Date().toISOString()
    };

    const updatedInvestments = [...investments, newInvestment];

    const { error } = await supabase
      .from('companies')
      .update({ equity_investments: updatedInvestments })
      .eq('company_name', companyName);

    if (error) {
      console.error('Error updating equity investments:', error);
      setLoading(false);
      return;
    }

    setInvestments(updatedInvestments);
    setRoundType('');
    setInvestedAmount('');
    setValuation('');
    setLoading(false);
  };

  const handleDelete = async (investmentId) => {
    const updatedInvestments = investments.filter((i) => i.id !== investmentId);

    const { error } = await supabase
      .from('companies')
      .update({ equity_investments: updatedInvestments })
      .eq('company_name', companyName);

    if (error) {
      console.error('Error deleting equity investment:', error);
      return;
    }

    setInvestments(updatedInvestments);
  };

  return (
    <div className="equityops-modal-overlay">
      <div className="equityops-modal-content">
        <button className="equityops-modal-close" onClick={onClose}>×</button>
        <h2>Equity Entry Opportunities for {companyName}</h2>
        
        <div className="equity-form">
          <input
            type="text"
            placeholder="Round Type (e.g., Series A)"
            value={roundType}
            onChange={(e) => setRoundType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Invested Amount (e.g., 1M)"
            value={investedAmount}
            onChange={(e) => setInvestedAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Valuation (e.g., 100M)"
            value={valuation}
            onChange={(e) => setValuation(e.target.value)}
          />
          <button onClick={handleAddInvestment} disabled={loading || !roundType || !investedAmount || !valuation}>
            {loading ? 'Saving...' : 'Add Investment'}
          </button>
        </div>

        <div className="equity-list">
          <h3>Existing Investments</h3>
          {investments.length === 0 && <p>No investments added yet.</p>}
          {investments.map((investment) => (
            <div key={investment.id} className="equity-investment-item">
              <div className="equity-investment-details">
                <strong>{investment.round_type}</strong>: {investment.invested_amount} at {investment.valuation}
              </div>
              <div className="equity-investment-date">
                Added on {new Date(investment.date_added).toLocaleDateString()}
              </div>
              <button className="delete-button" onClick={() => handleDelete(investment.id)}>Delete</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EquityInvestmentsModal;
