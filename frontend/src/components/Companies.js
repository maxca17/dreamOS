import React, { useState, useEffect } from 'react';
import '../css/components/companies.css';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';
import CompaniesModal from './CompaniesModal';

const Companies = (user) => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('*').order('company_name', { ascending: true });
    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCompanies = companies.filter((company) =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="companies-container">
      <NavBar />

      <aside className="filters-sidebar">
        <div className="filters-section">
          <h4>Company Type</h4>
          <label><input type="checkbox" defaultChecked /> Portfolio</label>
          <label><input type="checkbox" /> Prospect</label>
          <label><input type="checkbox" /> Network</label>
        </div>

        <div className="filters-section">
          <h4>Ranking</h4>
          <label><input type="checkbox" defaultChecked /> All</label>
          <label><input type="checkbox" /> Live Co-Invest</label>
          <label><input type="checkbox" /> 1</label>
          <label><input type="checkbox" /> 2</label>
          <label><input type="checkbox" /> 3</label>
        </div>

        <div className="filters-section"> {/* TODO: Change activities filter */}
          <h4>Activities</h4>
          <label><input type="checkbox" /> Top Activities</label>
          <label><input type="checkbox" /> Video Calls</label>
          <label><input type="checkbox" /> News</label>
          <label><input type="checkbox" /> Founder Monthly Email</label>
          <label><input type="checkbox" /> Social</label>
          <label><input type="checkbox" /> Ranking</label>
          <label><input type="checkbox" /> Announcements</label>
        </div>

        <div className="filters-section">
          <h4>Valuation</h4>
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
          <h4>Industry</h4>
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="tag-filter">Portfolio</button>

            <div className="sort-dropdown">
              <button className="sort-btn">Valuation ▼</button>
            </div>
          </div>

          <div className="companies-table-container">
            <table className="companies-table">
              <thead>
                <tr>
                  <th className="col-company">Company ({filteredCompanies.length})</th>
                  <th className="col-poc">POC</th>
                  <th className="col-website">Website</th>
                  <th className="col-round">Round</th>
                  <th className="col-sector">Sector</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c, index) => (
                  <tr 
                    key={index} 
                    className="company-row"
                    onClick={() => handleOpenModal(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="company-info-cell">
                      <div className="company-info">
                        <div 
                          className="company-logo" 
                          style={{ backgroundColor: c.logoColor || '#ccc' }}
                        ></div>
                        <div className="company-text">
                          <strong>{c.company_name}</strong>
                          <p>{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="company-meta-cell">{c.dream_poc || 'N/A'}</td>
                    <td className="company-meta-cell">{c.company_website || 'N/A'}</td>
                    <td className="company-meta-cell">{c.round || 'N/A'}</td>
                    <td className="company-meta-cell">{c.sector || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && selectedCompany && (
            <CompaniesModal 
              company={selectedCompany} 
              onClose={handleCloseModal} 
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Companies;
