import React, { useState, useEffect } from 'react';
import '../css/components/personmodal.css';
import { supabase } from '../supabaseClient';

function PersonModal({ person: initialPerson, onClose, onSave }) {
  const [person, setPerson] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPerson(initialPerson || {});
  }, [initialPerson]);

  const handleChange = (field, value) => {
    setPerson((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('people')
        .upsert(person, { returning: 'representation' });

      if (error) {
        console.error('Error saving person:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        const updatedPerson = data[0];
        // Update local state
        setPerson(updatedPerson);
        // Notify parent of the save
        if (onSave) {
          onSave(updatedPerson);
        }
      } else {
        console.warn('No data returned from upsert, but closing anyway.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setSaving(false);
      // Close the modal regardless of success or error
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="person-modal-overlay" onClick={onClose}>
      <div className="person-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="person-modal-close-button" onClick={onClose}>&times;</button>
        <div className="person-modal-content">
          <h1 className="person-modal-name">
            <input
              type="text"
              value={person.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="person-modal-name-input"
              placeholder="Name"
            />
          </h1>

          <div className="person-modal-fields">
            <div className="person-modal-field">
              <label>Company Name</label>
              <input
                type="text"
                value={person.company_name || ''}
                onChange={(e) => handleChange('company_name', e.target.value)}
              />
            </div>

            <div className="person-modal-field">
              <label>Stage</label>
              <select
                value={person.stage ? person.stage[0] : ''}
                onChange={(e) => handleChange('stage', [e.target.value])}
              >
                <option value="" disabled>Select stage</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Seed">Seed</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="person-modal-field">
              <label>Sector (Focus)</label>
              <input
                type="text"
                value={
                  Array.isArray(person.sector_focus)
                    ? person.sector_focus.join(', ')
                    : (person.sector_focus || '')
                }
                onChange={(e) =>
                  handleChange(
                    'sector_focus',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                placeholder="e.g. FinTech"
              />
            </div>
            <div className="person-modal-field">
              <label>Type</label>
              <input
                type="text"
                value={
                  Array.isArray(person.person_type)
                    ? person.person_type.join(', ')
                    : (person.person_type || '')
                }
                onChange={(e) =>
                  handleChange(
                    'person_type',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                placeholder="e.g. VC"
              />
            </div>
            <div className="person-modal-field">
              <label>City</label>
              <input
                type="text"
                value={person.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="person-modal-field">
              <label>Email</label>
              <input
                type="email"
                value={person.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="person-modal-field">
              <label>Last Meeting</label>
              <input
                type="date"
                value={
                  person.last_meeting
                    ? new Date(person.last_meeting).toISOString().substr(0, 10)
                    : ''
                }
                onChange={(e) => handleChange('last_meeting', e.target.value)}
              />
            </div>
            <div className="person-modal-field">
              <label>Lead POC from Dream</label>
              <input
                type="text"
                value={person.dream_poc || ''}
                onChange={(e) => handleChange('dream_poc', e.target.value)}
              />
            </div>
            <div className="person-modal-field">
              <label>Title</label>
              <input
                type="text"
                value={person.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="person-modal-field">
              <label>Check Size Range</label>
              <select
                value={person.check_size_range || ''}
                onChange={(e) => handleChange('check_size_range', e.target.value)}
              >
                <option value="">Select a range...</option>
                <option value="$0-250K">$0-250K</option>
                <option value="$250K-1M">$250K-1M</option>
                <option value="$1M-5M">$1M-5M</option>
                <option value="$5M+">$5M+</option>
              </select>
            </div>

            <div className="person-modal-field">
              <label>Address</label>
              <input
                type="text"
                value={person.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <div className="person-modal-field">
              <label>LinkedIn</label>
              <input
                type="text"
                value={person.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>
          </div>

          <div className="person-modal-notes">
            <h3>Notes</h3>
            <textarea
              value={person.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add notes..."
            />
          </div>

          <div className="person-modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonModal;
