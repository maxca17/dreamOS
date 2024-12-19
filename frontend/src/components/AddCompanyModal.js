import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/addcompanymodal.css'; // Create this CSS as needed

const AddCompanyModal = ({ onClose, onCompanyAdded }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    sector: '',
    stage: '',
    valuation: '',
    city: '',
    region: '',
    poc: '',
    overview: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!formData.company_name) {
      setErrorMsg('Company Name is required.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([formData]);

    if (error) {
      console.error('Error adding company:', error);
      setErrorMsg('Failed to add company. Please try again.');
      setLoading(false);
    } else {
      // Company added successfully
      setLoading(false);
      onClose();
      onCompanyAdded(); // Refresh the companies list
    }
  };

  return (
    <div className="add-company-modal-overlay">
      <div className="add-company-modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Add a New Company</h2>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="add-company-form">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              value={formData.company_website}
              onChange={(e) => handleChange('company_website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Sector</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => handleChange('sector', e.target.value)}
              placeholder="e.g. FinTech, CPG"
            />
          </div>

          <div className="form-group">
            <label>Stage</label>
            <select 
              value={formData.stage}
              onChange={(e) => handleChange('stage', e.target.value)}
            >
              <option value="">Select Stage</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
              <option value="Later Stage">Later Stage</option>
              <option value="IPO">IPO</option>
            </select>
          </div>

          <div className="form-group">
            <label>Valuation</label>
            <input
              type="text"
              value={formData.valuation}
              onChange={(e) => handleChange('valuation', e.target.value)}
              placeholder="e.g. 1000000 for $1,000,000"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. New York"
            />
          </div>

          <div className="form-group">
            <label>Region</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              placeholder="e.g. North America"
            />
          </div>

          <div className="form-group">
            <label>POC (Point of Contact)</label>
            <input
              type="text"
              value={formData.poc}
              onChange={(e) => handleChange('poc', e.target.value)}
              placeholder="e.g. Richard"
            />
          </div>

          <div className="form-group">
            <label>Overview</label>
            <textarea
              value={formData.overview}
              onChange={(e) => handleChange('overview', e.target.value)}
              placeholder="Short company overview..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Company'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
