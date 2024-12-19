import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/foundersmodal.css';

const FoundersModal = ({ companyName, onClose }) => {
  const [founders, setFounders] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const fetchFounders = useCallback(async () => {
    if (!companyName) {
      console.log('No companyName provided, cannot fetch founders.');
      return;
    }
    console.log('Fetching founders for company:', companyName);
    const { data, error } = await supabase
      .from('companies')
      .select('founders')
      .eq('company_name', companyName)
      .single();

    if (error) {
      console.error('Error fetching company founders:', error);
      return;
    }

    console.log('Founders data fetched:', data?.founders);
    setFounders(Array.isArray(data?.founders) ? data.founders : []);
  }, [companyName]);

  const fetchAllPeople = useCallback(async () => {
    console.log('Fetching all people...');
    const { data, error } = await supabase
      .from('people')
      .select('id, name');

    if (error) {
      console.error('Error fetching people:', error);
      return;
    }

    console.log('All people fetched:', data);
    setAllPeople(data || []);
  }, []);

  useEffect(() => {
    fetchFounders();
    fetchAllPeople();
  }, [companyName, fetchFounders, fetchAllPeople]);

  const handleAddFounder = async () => {
    console.log('Add Founder Clicked');
    if (!selectedPersonId) {
      console.log('No person selected.');
      return;
    }
    if (!companyName) {
      console.log('No companyName provided, cannot add founder.');
      return;
    }

    // Find the selected person
    const personToAdd = allPeople.find((p) => p.id === selectedPersonId);
    if (!personToAdd) {
      console.log('Selected person not found in allPeople array.');
      return;
    }

    console.log('Adding founder:', personToAdd);

    const newFounder = {
      id: personToAdd.id,
      name: personToAdd.name,
      added_date: new Date().toISOString()
    };

    const updatedFounders = [...founders, newFounder];

    // Update the database with the new founders list
    const { error: updateError } = await supabase
      .from('companies')
      .update({ founders: updatedFounders })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating founders:', updateError);
      return;
    }

    console.log('Founder added successfully. Updated founders:', updatedFounders);
    setFounders(updatedFounders);
    setSelectedPersonId(null);
  };

  const handleDeleteFounder = async (founderId) => {
    console.log('Delete Founder Clicked for founderId:', founderId);
    const updatedFounders = founders.filter((f) => f.id !== founderId);

    const { error: updateError } = await supabase
      .from('companies')
      .update({ founders: updatedFounders })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating company founders:', updateError);
      return;
    }

    console.log('Founder removed successfully. Updated founders:', updatedFounders);
    setFounders(updatedFounders);
  };

  return (
    <div className="founders-modal-overlay">
      <div className="founders-modal-content">
        <button className="founders-modal-close" onClick={onClose}>×</button>
        <h2>Founders for {companyName}</h2>

        <div className="add-founder-section">
          <select
            value={selectedPersonId || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Convert the value to a number since 'id' is numeric in the DB
              const numericValue = value ? parseInt(value, 10) : null;
              setSelectedPersonId(numericValue);
            }}
          >
            <option value="">Select a person</option>
            {allPeople.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddFounder} disabled={!selectedPersonId}>
            Add Founder
          </button>
        </div>

        <div className="founders-list">
          <h3>Current Founders</h3>
          {founders.length === 0 && <p>No founders added yet.</p>}
          {founders.map((founder) => (
            <div key={founder.id} className="founder-item">
              <span className="founder-name">{founder.name}</span>
              <span className="founder-date">
                {new Date(founder.added_date).toLocaleDateString()}
              </span>
              <button
                className="delete-founder-button"
                onClick={() => handleDeleteFounder(founder.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoundersModal;
