import React from 'react';
import { supabase } from '../supabaseClient';

const LPDetailsModal = ({ lp, onClose }) => {
  if (!lp) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>LP Details</h3>
        <p><strong>Name:</strong> {lp.name}</p>
        <p><strong>Email:</strong> {lp.email}</p>
        <p><strong>Phone:</strong> {lp.phone}</p>
        <p><strong>Commitment:</strong> {lp.commitment_amount ? `$${lp.commitment_amount}` : 'N/A'}</p>
        <p><strong>Fund Number:</strong> {lp.fund_number}</p>

        {/* Example: Remove LP or do other actions */}
        {/* 
          <button onClick={() => handleDelete(lp.id)}>Delete LP</button>
        */}

        <button onClick={onClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default LPDetailsModal;
