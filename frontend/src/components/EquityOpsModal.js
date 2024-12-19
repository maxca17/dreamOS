import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/equityopsmodal.css'; // We'll define this CSS below

const EquityOpsModal = ({ companyName, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [roundType, setRoundType] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [valuation, setValuation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOffers = useCallback(async () => {
    if (!companyName) return;
    const { data, error } = await supabase
      .from('companies')
      .select('equity_offers')
      .eq('company_name', companyName)
      .single();

    if (error) {
      console.error('Error fetching equity offers:', error);
      return;
    }

    setOffers(Array.isArray(data?.equity_offers) ? data.equity_offers : []);
  }, [companyName]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleAddOffer = async () => {
    if (!roundType || !investedAmount || !valuation) return;
    setLoading(true);

    const newOffer = {
      id: `${Date.now()}`,
      round_type: roundType,
      invested_amount: investedAmount,
      valuation: valuation,
      date_added: new Date().toISOString()
    };

    const updatedOffers = [...offers, newOffer];

    const { error } = await supabase
      .from('companies')
      .update({ equity_offers: updatedOffers })
      .eq('company_name', companyName);

    if (error) {
      console.error('Error updating equity offers:', error);
      setLoading(false);
      return;
    }

    setOffers(updatedOffers);
    setRoundType('');
    setInvestedAmount('');
    setValuation('');
    setLoading(false);
  };

  const handleDelete = async (offerId) => {
    const updatedOffers = offers.filter((o) => o.id !== offerId);

    const { error } = await supabase
      .from('companies')
      .update({ equity_offers: updatedOffers })
      .eq('company_name', companyName);

    if (error) {
      console.error('Error deleting equity offer:', error);
      return;
    }

    setOffers(updatedOffers);
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
          <button onClick={handleAddOffer} disabled={loading || !roundType || !investedAmount || !valuation}>
            {loading ? 'Saving...' : 'Add Offer'}
          </button>
        </div>

        <div className="equity-list">
          <h3>Existing Offers</h3>
          {offers.length === 0 && <p>No offers added yet.</p>}
          {offers.map((offer) => (
            <div key={offer.id} className="equity-offer-item">
              <div className="equity-offer-details">
                <strong>{offer.round_type}</strong>: {offer.invested_amount} at {offer.valuation}
              </div>
              <div className="equity-offer-date">
                Added on {new Date(offer.date_added).toLocaleDateString()}
              </div>
              <button className="delete-button" onClick={() => handleDelete(offer.id)}>Delete</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EquityOpsModal;
