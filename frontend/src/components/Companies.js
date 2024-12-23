import React, { useState, useEffect } from 'react';
import '../css/components/companies.css';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';
import CompaniesModal from './CompaniesModal';
import AddCompanyModal from './AddCompanyModal';

const Companies = (user) => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [filters, setFilters] = useState({
    companyType: { all: true },
    dealLead: { all: true },
    sector: { all: true },
    valuation: { all: true },
    round: { all: true },
    processStage: { all: true }
  });

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  // Fetch on initial load
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch when modal state changes from open to closed
  useEffect(() => {
    if (!isModalOpen) {
      fetchCompanies();
    }
  }, [isModalOpen]);

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

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (value === 'all') {
        const newState = { ...prev[filterType] };
        if (!prev[filterType].all) {
          Object.keys(newState).forEach((key) => {
            newState[key] = key === 'all';
          });
        }
        return {
          ...prev,
          [filterType]: newState
        };
      } else {
        const newFilterState = {
          ...prev[filterType],
          all: false,
          [value]: !prev[filterType][value]
        };

        const hasCheckedOption = Object.entries(newFilterState).some(
          ([key, val]) => key !== 'all' && val
        );

        if (!hasCheckedOption) {
          newFilterState.all = true;
        }

        return {
          ...prev,
          [filterType]: newFilterState
        };
      }
    });
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
          <label><input type="checkbox" checked={filters.companyType.all} onChange={() => handleFilterChange('companyType', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.companyType.watchlist} onChange={() => handleFilterChange('companyType', 'watchlist')} /> Watchlist</label>
          <label><input type="checkbox" checked={filters.companyType.reviewing} onChange={() => handleFilterChange('companyType', 'reviewing')} /> Reviewing</label>
          <label><input type="checkbox" checked={filters.companyType.dueDiligence} onChange={() => handleFilterChange('companyType', 'dueDiligence')} /> Due Diligence</label>
          <label><input type="checkbox" checked={filters.companyType.icReview} onChange={() => handleFilterChange('companyType', 'icReview')} /> IC Review</label>
          <label><input type="checkbox" checked={filters.companyType.approvedLegal} onChange={() => handleFilterChange('companyType', 'approvedLegal')} /> Approved - Legal</label>
          <label><input type="checkbox" checked={filters.companyType.approvedNotFunded} onChange={() => handleFilterChange('companyType', 'approvedNotFunded')} /> Approved - Not Funded</label>
          <label><input type="checkbox" checked={filters.companyType.warehouse} onChange={() => handleFilterChange('companyType', 'warehouse')} /> Warehouse Deals</label>
          <label><input type="checkbox" checked={filters.companyType.portfolio} onChange={() => handleFilterChange('companyType', 'portfolio')} /> Portfolio</label>
          <label><input type="checkbox" checked={filters.companyType.passed} onChange={() => handleFilterChange('companyType', 'passed')} /> Passed</label>
        </div>

        <div className="filters-section">
          <h4>Deal Lead</h4>
          <label><input type="checkbox" checked={filters.dealLead.all} onChange={() => handleFilterChange('dealLead', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.dealLead.richard} onChange={() => handleFilterChange('dealLead', 'richard')} /> Richard Blankenship</label>
          <label><input type="checkbox" checked={filters.dealLead.joe} onChange={() => handleFilterChange('dealLead', 'joe')} /> Joe Kakaty</label>
          <label><input type="checkbox" checked={filters.dealLead.jonah} onChange={() => handleFilterChange('dealLead', 'jonah')} /> Jonah Vella</label>
          <label><input type="checkbox" checked={filters.dealLead.eric} onChange={() => handleFilterChange('dealLead', 'eric')} /> Eric Wong</label>
          <label><input type="checkbox" checked={filters.dealLead.oli} onChange={() => handleFilterChange('dealLead', 'oli')} /> Oli Harris</label>
          <label><input type="checkbox" checked={filters.dealLead.aryan} onChange={() => handleFilterChange('dealLead', 'aryan')} /> Aryan Bhatnagar</label>
        </div>

        <div className="filters-section"> 
          <h4>Sector</h4>
          <label><input type="checkbox" checked={filters.sector.all} onChange={() => handleFilterChange('sector', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.sector.cpg} onChange={() => handleFilterChange('sector', 'cpg')} /> CPG</label>
          <label><input type="checkbox" checked={filters.sector.technology} onChange={() => handleFilterChange('sector', 'technology')} /> Technology</label>
          <label><input type="checkbox" checked={filters.sector.vc} onChange={() => handleFilterChange('sector', 'vc')} /> Venture Capital</label>
          <label><input type="checkbox" checked={filters.sector.pe} onChange={() => handleFilterChange('sector', 'pe')} /> Private Equity</label>
        </div>

        <div className="filters-section">
          <h4>Valuation</h4>
          <label><input type="checkbox" checked={filters.valuation.all} onChange={() => handleFilterChange('valuation', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.valuation.plus5b} onChange={() => handleFilterChange('valuation', 'plus5b')} /> +5b</label>
          <label><input type="checkbox" checked={filters.valuation.b1to5} onChange={() => handleFilterChange('valuation', 'b1to5')} /> 1-5b</label>
          <label><input type="checkbox" checked={filters.valuation.m500to1b} onChange={() => handleFilterChange('valuation', 'm500to1b')} /> 500m-1b</label>
          <label><input type="checkbox" checked={filters.valuation.m100to500} onChange={() => handleFilterChange('valuation', 'm100to500')} /> 100-500m</label>
          <label><input type="checkbox" checked={filters.valuation.m50to100} onChange={() => handleFilterChange('valuation', 'm50to100')} /> 50-100m</label>
          <label><input type="checkbox" checked={filters.valuation.under50m} onChange={() => handleFilterChange('valuation', 'under50m')} /> &lt;50m</label>
          <label><input type="checkbox" checked={filters.valuation.na} onChange={() => handleFilterChange('valuation', 'na')} /> N/A</label>
        </div>

        <div className="filters-section">
          <h4>Round</h4>
          <label><input type="checkbox" checked={filters.round.all} onChange={() => handleFilterChange('round', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.round.preSeed} onChange={() => handleFilterChange('round', 'preSeed')} /> Pre-Seed</label>
          <label><input type="checkbox" checked={filters.round.seed} onChange={() => handleFilterChange('round', 'seed')} /> Seed</label>
          <label><input type="checkbox" checked={filters.round.seriesA} onChange={() => handleFilterChange('round', 'seriesA')} /> Series A</label>
          <label><input type="checkbox" checked={filters.round.seriesB} onChange={() => handleFilterChange('round', 'seriesB')} /> Series B</label>
          <label><input type="checkbox" checked={filters.round.seriesC} onChange={() => handleFilterChange('round', 'seriesC')} /> Series C</label>
          <label><input type="checkbox" checked={filters.round.seriesD} onChange={() => handleFilterChange('round', 'seriesD')} /> Series D</label>
          <label><input type="checkbox" checked={filters.round.bridge} onChange={() => handleFilterChange('round', 'bridge')} /> Bridge Round</label>
          <label><input type="checkbox" checked={filters.round.growth} onChange={() => handleFilterChange('round', 'growth')} /> Growth Round</label>
          <label><input type="checkbox" checked={filters.round.none} onChange={() => handleFilterChange('round', 'none')} /> None-N/A</label>
        </div>

        <div className="filters-section">
          <h4>Process Stage</h4>
          <label><input type="checkbox" checked={filters.processStage.all} onChange={() => handleFilterChange('processStage', 'all')} /> All</label>
          <label><input type="checkbox" checked={filters.processStage.deckReview} onChange={() => handleFilterChange('processStage', 'deckReview')} /> Deck Review</label>
          <label><input type="checkbox" checked={filters.processStage.introCall} onChange={() => handleFilterChange('processStage', 'introCall')} /> Intro Call</label>
          <label><input type="checkbox" checked={filters.processStage.secondCall} onChange={() => handleFilterChange('processStage', 'secondCall')} /> Second Call</label>
          <label><input type="checkbox" checked={filters.processStage.diligence} onChange={() => handleFilterChange('processStage', 'diligence')} /> Diligence</label>
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

            <div className="sort-dropdown">
              <button 
                className="sort-btn" 
                onClick={() => setShowAddCompanyModal(true)} // NEW: Open AddCompanyModal
              >
                Add a Company
              </button>
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

          {showAddCompanyModal && (
            <AddCompanyModal 
              onClose={() => setShowAddCompanyModal(false)}
              onCompanyAdded={fetchCompanies} // NEW: Refresh list after adding a new company
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Companies;
