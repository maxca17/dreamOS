import React, { useState, useEffect } from 'react';
import '../css/components/companies.css'; // Adjust to the correct CSS path
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';
import PortfolioCompaniesModal from './PortfolioCompaniesModal';

const PortfolioCompanies = (user) => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch all companies with 'Portfolio Company' in the status column
  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'Portfolio Company')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Open the PortfolioCompaniesModal
  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  // Close the PortfolioCompaniesModal
  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  return (
    <div className="companies-container">
      <NavBar />

      {/* SIDEBAR FILTERS */}
      <aside className="filters-sidebar">
        <div className="filters-section">
          <h4>Company Status</h4>
          <label><input type="checkbox" /> All</label>
          <label><input type="checkbox" defaultChecked /> Active</label>
          <label><input type="checkbox" /> Dead</label>
        </div>

        <div className="filters-section">
          <h4>Fund</h4>
          <label><input type="checkbox" defaultChecked /> All</label>
          <label><input type="checkbox" /> 1</label>
          <label><input type="checkbox" /> 2</label>
        </div>

        <div className="filters-section">
          <h4>Sector</h4>
          <label><input type="checkbox" defaultChecked /> All</label>
          <label><input type="checkbox" /> B2B / SaaS</label>
          <label><input type="checkbox" /> AI</label>
          <label><input type="checkbox" /> FinTech</label>
          <label><input type="checkbox" /> FrontierTech</label>
        </div>

        <div className="filters-section">
          <h4>Check Size</h4>
          <label><input type="checkbox" defaultChecked /> All</label>
          <label><input type="checkbox" /> +5b</label>
          <label><input type="checkbox" /> 1-5b</label>
          <label><input type="checkbox" /> 500m-1b</label>
          <label><input type="checkbox" /> 100-500m</label>
          <label><input type="checkbox" /> 50-100m</label>
          <label><input type="checkbox" /> &lt;50m</label>
          <label><input type="checkbox" /> N/A</label>
        </div>

        <div className="filters-section">
          <h4>Sector</h4>
          <label><input type="checkbox" defaultChecked /> All</label>
          <label><input type="checkbox" /> B2B / SaaS</label>
          <label><input type="checkbox" /> AI</label>
          <label><input type="checkbox" /> FinTech</label>
          <label><input type="checkbox" /> FrontierTech</label>
        </div>
      </aside>

      <div className="companies-content-wrapper">
        <div className="companies-content">
          <div className="breadcrumb">
            <span>Home</span> &gt; <span>Companies</span>
          </div>

          <div className="filters-bar">
            <input 
              type="text"
              placeholder="Search for companies"
              className="search-companies"
            />
            <button className="tag-filter">Portfolio</button>

            <div className="sort-dropdown">
              <button className="sort-btn">Valuation ▼</button>
            </div>
          </div>

          {/* TABLE OF COMPANIES */}
          <div className="companies-table-container">
            <table className="companies-table">
              <thead>
                <tr>
                  <th className="col-company">
                    Company ({companies.length})
                  </th>
                  <th className="col-poc">POC</th>
                  <th className="col-website">Website</th>
                  <th className="col-round">Round</th>
                  <th className="col-sector">Sector</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, index) => (
                  <tr
                    key={index}
                    className="company-row"
                    onClick={() => handleOpenModal(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="company-info-cell">
                      <div className="company-info">
                        {/* Display the logo if logo_url exists, else a placeholder */}
                        <div className="company-logo-wrapper">
                          {c.logo_url ? (
                            <img
                              src={c.logo_url}
                              alt={`${c.company_name} logo`}
                              className="company-logo-img"
                            />
                          ) : (
                            <div className="company-logo-placeholder">
                              No Logo
                            </div>
                          )}
                        </div>

                        <div className="company-text">
                          <strong>{c.company_name}</strong>
                          <p>{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="company-meta-cell">
                      {c.dream_poc || 'N/A'}
                    </td>
                    <td className="company-meta-cell">
                      {c.company_website || 'N/A'}
                    </td>
                    <td className="company-meta-cell">
                      {c.round || 'N/A'}
                    </td>
                    <td className="company-meta-cell">
                      {c.sector || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL */}
          {isModalOpen && selectedCompany && (
            <PortfolioCompaniesModal
              company={selectedCompany}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCompanies;
