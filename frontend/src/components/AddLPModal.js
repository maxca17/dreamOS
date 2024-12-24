import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddLPModal = ({ onClose, onLPAdded, fund }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commitment, setCommitment] = useState('');

  const handleAdd = async () => {
    try {
      const fundNumber = fund === 'fund1' ? 1 : 2;
      const { error } = await supabase
        .from('lps')
        .insert([
          {
            name,
            email,
            phone,
            commitment_amount: commitment,
            fund_number: fundNumber,
          },
        ]);

      if (error) throw error;

      // Trigger refetch in parent
      onLPAdded();
    } catch (err) {
      console.error('Error adding LP:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add a Limited Partner</h3>
        <div className="modal-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="LP Name"
          />
        </div>
        <div className="modal-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="LP Email"
          />
        </div>
        <div className="modal-field">
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="LP Phone"
          />
        </div>
        <div className="modal-field">
          <label>Commitment Amount</label>
          <input
            type="number"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="1000000"
          />
        </div>

        <div className="modal-buttons">
          <button onClick={handleAdd}>Add</button>
          <button onClick={onClose} className="modal-close-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLPModal;
