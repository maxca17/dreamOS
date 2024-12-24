import React, { useState, useEffect } from 'react';
import '../css/components/companies.css';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';
import CompaniesModal from './CompaniesModal';
import AddCompanyModal from './AddCompanyModal';

/**
 * Filter configuration to drive the UI rendering for checkboxes.
 */
const FILTER_CONFIG = [
  {
    key: 'companyType',
    title: 'Company Type',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Watchlist', value: 'watchlist' },
      { label: 'Reviewing', value: 'reviewing' },
      { label: 'Due Diligence', value: 'dueDiligence' },
      { label: 'IC Review', value: 'icReview' },
      { label: 'Approved - Legal', value: 'approvedLegal' },
      { label: 'Approved - Not Funded', value: 'approvedNotFunded' },
      { label: 'Warehouse Deals', value: 'warehouse' },
      { label: 'Portfolio', value: 'portfolio' },
      { label: 'Passed', value: 'passed' }
    ]
  },
  {
    key: 'poc',
    title: 'POC',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Richard Blankenship', value: 'Richard' },
      { label: 'Joe Kakaty', value: 'joe' },
      { label: 'Jonah Vella', value: 'jonah' },
      { label: 'Eric Wong', value: 'eric' },
      { label: 'Oli Harris', value: 'oli' },
      { label: 'Aryan Bhatnagar', value: 'Aryan' }
    ]
  },
  {
    key: 'sector',
    title: 'Sector',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Consumer', value: 'Consumer' },
      { label: 'Technology', value: 'Technology' },
      { label: 'Venture Capital', value: 'vc' },
      { label: 'Private Equity', value: 'pe' }
    ]
  },
  {
    key: 'valuation',
    title: 'Valuation',
    options: [
      { label: 'All', value: 'all' },
      { label: '+5b', value: 'plus5b' },
      { label: '1-5b', value: 'b1to5' },
      { label: '500m-1b', value: 'm500to1b' },
      { label: '100-500m', value: 'm100to500' },
      { label: '50-100m', value: 'm50to100' },
      { label: '<50m', value: 'under50m' },
      { label: 'N/A', value: 'na' }
    ]
  },
  {
    key: 'round',
    title: 'Round',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Pre-Seed', value: 'preSeed' },
      { label: 'Seed', value: 'seed' },
      { label: 'Series A', value: 'seriesA' },
      { label: 'Series B', value: 'seriesB' },
      { label: 'Series C', value: 'seriesC' },
      { label: 'Series D', value: 'seriesD' },
      { label: 'Bridge Round', value: 'bridge' },
      { label: 'Growth Round', value: 'growth' },
      { label: 'None-N/A', value: 'none' }
    ]
  },
  {
    key: 'processStage',
    title: 'Process Stage',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Deck Review', value: 'deckReview' },
      { label: 'Intro Call', value: 'introCall' },
      { label: 'Second Call', value: 'secondCall' },
      { label: 'Diligence', value: 'diligence' }
    ]
  }
];

/**
 * Initializes all filters to 'all'.
 */
function initFilters() {
  const initialFilters = {};
  FILTER_CONFIG.forEach(({ key, options }) => {
    initialFilters[key] = options.reduce((acc, opt) => {
      // default everything to false except 'all' which is true
      acc[opt.value] = opt.value === 'all';
      return acc;
    }, {});
  });
  return initialFilters;
}

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  // One object containing all filter states
  const [filters, setFilters] = useState(initFilters);

  // ========== FETCH COMPANIES FROM SUPABASE ==========
  const fetchCompanies = async () => {
    try {
      let { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Re-fetch when the modal closes (only if needed)
  useEffect(() => {
    if (!isModalOpen) {
      fetchCompanies();
    }
  }, [isModalOpen]);

  // ========== MODAL HANDLERS ==========
  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  // ========== SEARCH HANDLER ==========
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ========== FILTER HANDLER ==========
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => {
      const newFilterState = { ...prev[filterKey] };

      if (value === 'all') {
        // toggling 'All' => set 'all' to true, everything else to false
        const isCurrentlyAll = newFilterState.all;
        Object.keys(newFilterState).forEach((k) => {
          newFilterState[k] = false;
        });
        newFilterState.all = !isCurrentlyAll; // toggle
      } else {
        // toggle specific value, uncheck 'all'
        newFilterState[value] = !newFilterState[value];
        newFilterState.all = false;

        // if nothing is selected after toggling, revert to 'all'
        const somethingSelected = Object.keys(newFilterState).some(
          (k) => k !== 'all' && newFilterState[k]
        );
        if (!somethingSelected) {
          // revert to all
          Object.keys(newFilterState).forEach((k) => {
            newFilterState[k] = k === 'all';
          });
        }
      }
      return { ...prev, [filterKey]: newFilterState };
    });
  };

  // ========== FILTERED COMPANIES ==========
  const filteredCompanies = companies.filter((company) => {
    // 1) search term
    const matchesSearch = company.company_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 2) destructure all filters
    const { companyType, poc, sector, valuation, round, processStage } = filters;

    // 3) check each group
    const matchesCompanyType =
      companyType.all ||
      Object.keys(companyType).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!companyType[filterValue]) return false;
        return company.company_type === filterValue;
      });

    const matchesPoc =
      poc.all ||
      Object.keys(poc).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!poc[filterValue]) return false;
        // match the DB's poc column
        return company.poc === filterValue;
      });

    const matchesSector =
      sector.all ||
      Object.keys(sector).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!sector[filterValue]) return false;
        return company.sector === filterValue;
      });

    const matchesValuation =
      valuation.all ||
      Object.keys(valuation).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!valuation[filterValue]) return false;
        return company.valuation === filterValue;
      });

    const matchesRound =
      round.all ||
      Object.keys(round).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!round[filterValue]) return false;
        return company.round === filterValue;
      });

    const matchesProcessStage =
      processStage.all ||
      Object.keys(processStage).some((filterValue) => {
        if (filterValue === 'all') return false;
        if (!processStage[filterValue]) return false;
        return company.process_stage === filterValue;
      });

    // 4) combine all checks
    return (
      matchesSearch &&
      matchesCompanyType &&
      matchesPoc &&
      matchesSector &&
      matchesValuation &&
      matchesRound &&
      matchesProcessStage
    );
  });

  return (
    <div className="companies-container">
      <NavBar />

      {/* SIDEBAR FOR FILTERS */}
      <aside className="filters-sidebar">
        {FILTER_CONFIG.map(({ key, title, options }) => (
          <div className="filters-section" key={key}>
            <h4>{title}</h4>
            {options.map(({ label, value }) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={filters[key][value]}
                  onChange={() => handleFilterChange(key, value)}
                />
                {label}
              </label>
            ))}
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT */}
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
                onClick={() => setShowAddCompanyModal(true)}
              >
                Add a Company
              </button>
            </div>
          </div>

          {/* COMPANIES TABLE */}
          <div className="companies-table-container">
            <table className="companies-table">
              <thead>
                <tr>
                  <th className="col-company">
                    Company ({filteredCompanies.length})
                  </th>
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
                          <p>{c.description || ''}</p>
                        </div>
                      </div>
                    </td>
                    {/* We use c.poc to display, matching DB column */}
                    <td className="company-meta-cell">
                      {c.poc || 'N/A'}
                    </td>
                    <td className="company-meta-cell">
                      {c.company_website || 'N/A'}
                    </td>
                    <td className="company-meta-cell">{c.round || 'N/A'}</td>
                    <td className="company-meta-cell">{c.sector || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODALS */}
          {isModalOpen && selectedCompany && (
            <CompaniesModal
              company={selectedCompany}
              onClose={handleCloseModal}
            />
          )}

          {showAddCompanyModal && (
            <AddCompanyModal
              onClose={() => setShowAddCompanyModal(false)}
              onCompanyAdded={fetchCompanies}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
