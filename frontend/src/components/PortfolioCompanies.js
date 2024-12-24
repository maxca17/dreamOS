import React, { useState, useEffect } from 'react';
import '../css/components/companies.css'; // Adjust if needed
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';
import PortfolioCompaniesModal from './PortfolioCompaniesModal';

/**
 * Configuration for the sidebar filters. Each section
 * has a 'title' and a list of 'options'.
 *
 * You can expand or change this as you like.
 * Duplicate "Sector" sections from your code are included for fidelity.
 */
const FILTER_SECTIONS = [
  {
    title: 'Company Status',
    options: [
      { label: 'All', defaultChecked: false },
      { label: 'Active', defaultChecked: true },
      { label: 'Dead', defaultChecked: false }
    ]
  },
  {
    title: 'Fund',
    options: [
      { label: 'All', defaultChecked: true },
      { label: '1', defaultChecked: false },
      { label: '2', defaultChecked: false }
    ]
  },
  {
    title: 'Sector',
    options: [
      { label: 'All', defaultChecked: true },
      { label: 'B2B / SaaS', defaultChecked: false },
      { label: 'AI', defaultChecked: false },
      { label: 'FinTech', defaultChecked: false },
      { label: 'FrontierTech', defaultChecked: false }
    ]
  },
  {
    title: 'Check Size',
    options: [
      { label: 'All', defaultChecked: true },
      { label: '+5b', defaultChecked: false },
      { label: '1-5b', defaultChecked: false },
      { label: '500m-1b', defaultChecked: false },
      { label: '100-500m', defaultChecked: false },
      { label: '50-100m', defaultChecked: false },
      { label: '<50m', defaultChecked: false },
      { label: 'N/A', defaultChecked: false }
    ]
  },
  {
    title: 'Sector', // repeated per your original code
    options: [
      { label: 'All', defaultChecked: true },
      { label: 'B2B / SaaS', defaultChecked: false },
      { label: 'AI', defaultChecked: false },
      { label: 'FinTech', defaultChecked: false },
      { label: 'FrontierTech', defaultChecked: false }
    ]
  }
];

const PortfolioCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch all companies with 'Portfolio Company' in the "status" column
  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('status', 'Portfolio Company')
        .order('company_name', { ascending: true });

      if (error) {
        throw error;
      }
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Open the modal
  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  /**
   * Renders the entire "filters sidebar" using our filter config.
   * Currently, these checkboxes don't do anything except appear checked/unchecked.
   * (If you want them to actually filter the table, you’d need more state & logic.)
   */
  const renderFiltersSidebar = () => {
    return (
      <aside className="filters-sidebar">
        {FILTER_SECTIONS.map((section, idx) => (
          <div className="filters-section" key={idx}>
            <h4>{section.title}</h4>
            {section.options.map((opt, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  defaultChecked={opt.defaultChecked}
                />
                {opt.label}
              </label>
            ))}
          </div>
        ))}
      </aside>
    );
  };

  return (
    <div className="companies-container">
      <NavBar />

      {/* SIDEBAR FILTERS */}
      {renderFiltersSidebar()}

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
                        {/* Logo or placeholder */}
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
                      {c.poc || 'N/A'}
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
