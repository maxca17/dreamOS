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
        setPerson(updatedPerson);
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
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="person-modal-overlay" onClick={onClose}>
      <div className="person-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="person-modal-close" onClick={onClose}>×</button>

        <div className="person-modal-header">
          <input
            type="text"
            value={person.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="person-modal-name-input"
            placeholder="Person Name"
          />
        </div>

        <div className="person-modal-grid">
          {/* LEFT COLUMN */}
          <div className="person-modal-left">
            <div className="person-info-card">
              <div className="person-info-header">
                <h3>Person Information</h3>
              </div>
              <div className="person-info-grid">
                <div className="info-item">
                  <span className="info-label">Company Name</span>
                  <input
                    type="text"
                    value={person.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Stage</span>
                  <select
                    value={person.stage || ''}
                    onChange={(e) => handleChange('stage', e.target.value)}
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
                <div className="info-item">
                  <span className="info-label">Sector (Focus)</span>
                  <input
                    type="text"
                    value={person.sector_focus || ''}
                    onChange={(e) => handleChange('sector_focus', e.target.value)}
                    placeholder="e.g. FinTech"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Type</span>
                  <input
                    type="text"
                    value={person.person_type || ''}
                    onChange={(e) => handleChange('person_type', e.target.value)}
                    placeholder="e.g. VC"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">City</span>
                  <input
                    type="text"
                    value={person.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <input
                    type="email"
                    value={person.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Last Meeting</span>
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
                <div className="info-item">
                  <span className="info-label">Lead POC from Dream</span>
                  <input
                    type="text"
                    value={person.dream_poc || ''}
                    onChange={(e) => handleChange('dream_poc', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Title</span>
                  <input
                    type="text"
                    value={person.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Check Size Range</span>
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
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <input
                    type="text"
                    value={person.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">LinkedIn</span>
                  <input
                    type="text"
                    value={person.linkedin || ''}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                  />
                </div>
                <div className="info-item info-notes-full">
                  <span className="info-label">Notes</span>
                  <textarea
                    value={person.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Add notes..."
                  />
                </div>
              </div>

              <div className="person-modal-actions">
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="person-modal-right">
            <div className="side-card">
              <h4>Recent Interactions</h4>
              <ul className="side-list">
                <li>Met at Web Summit 2023</li>
                <li>Intro call to partner at XYZ VC</li>
                <li>Shared pitch deck for ABC startup</li>
              </ul>
            </div>

            <div className="side-card">
              <h4>Documents</h4>
              <ul className="side-list">
                <li><a href="#">Resume.pdf</a></li>
                <li><a href="#">Meeting Notes.docx</a></li>
              </ul>
            </div>

            <div className="side-card">
              <h4>Contact Methods</h4>
              <p>Email: {person.email || 'N/A'}</p>
              {person.linkedin && (
                <p>
                  LinkedIn: <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </p>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonModal;
