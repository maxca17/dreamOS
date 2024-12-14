import React from 'react';
import '../css/components/personmodal.css';

function formatDate(dateString) {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options).replace(/\//g, '/');
}

function PersonModal({ person, onClose }) {
  return (
    <div className="person-modal-overlay">
      <div className="person-modal-container">
        <h2 className="person-modal-name">{person.name}</h2>
        <p className="person-modal-detail">
          <span className="person-modal-label">Email:</span> {person.email || 'N/A'}
        </p>
        <p className="person-modal-detail">
          <span className="person-modal-label">Title:</span> {person.title || 'N/A'}
        </p>
        <p className="person-modal-detail">
          <span className="person-modal-label">LinkedIn:</span>{' '}
          {person.linkedin ? (
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
              {person.linkedin}
            </a>
          ) : (
            'N/A'
          )}
        </p>
        <p className="person-modal-detail">
          <span className="person-modal-label">Date Added:</span> {person.created_at ? formatDate(person.created_at) : 'N/A'}
        </p>
        <button className="person-modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PersonModal;
