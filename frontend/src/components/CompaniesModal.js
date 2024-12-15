import React from 'react';
import '../css/components/companiesmodal.css';

const CompaniesModal = ({ company, onClose }) => {
  return (
    <div className="companies-modal-overlay">
      <div className="companies-modal-content">
        <button className="companies-modal-close" onClick={onClose}>X</button>
        <h2>{company.company_name}</h2>
        <p><strong>Description:</strong> {company.description || 'N/A'}</p>
        <p><strong>POC:</strong> {company.dream_poc || 'N/A'}</p>
        <p><strong>Website:</strong> {company.company_website || 'N/A'}</p>
        <p><strong>Round:</strong> {company.round || 'N/A'}</p>
        <p><strong>Sector:</strong> {company.sector || 'N/A'}</p>
      </div>
    </div>
  );
};

export default CompaniesModal;
