import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../constants/Navbar';
import '../css/components/people.css';
import PersonModal from './PersonModal';

function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Basic single search term:
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced search state for each column:
  const [advancedSearch, setAdvancedSearch] = useState({
    name: '',
    title: '',
    person_type: '',
    sector_focus: '',
    company_name: '',
    email: '',
    city: '',
    linkedin: '',
  });

  // Toggles whether we're in advanced or basic search mode:
  const [isAdvanced, setIsAdvanced] = useState(false);

  // Fetch people from Supabase:
  const fetchPeople = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setPeople(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // Handle opening a person’s modal:
  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  // Close the modal, refresh people:
  const handleCloseModal = () => {
    setSelectedPerson(null);
    fetchPeople();
  };

  // Handle adding a person (no pre-filled data):
  const handleAddPerson = () => {
    setSelectedPerson({});
  };

  // Basic single search filter:
  const basicFilteredPeople = people.filter((person) => {
    const combinedData = `
      ${person.name || ''} 
      ${person.title || ''} 
      ${person.person_type || ''} 
      ${person.sector_focus || ''} 
      ${person.company_name || ''} 
      ${person.email || ''} 
      ${person.city || ''} 
      ${person.linkedin || ''}
    `.toLowerCase();
    return combinedData.includes(searchTerm.toLowerCase());
  });

  // Advanced search filter:
  const advancedFilteredPeople = people.filter((person) => {
    // For each key in advancedSearch, if user typed something, it must be found in person[key].
    // If the user left the field blank, we ignore it (treat as always passing).
    return Object.entries(advancedSearch).every(([key, value]) => {
      if (!value) return true; // No filter on this field
      if (!person[key]) return false; // If there's no data but user did type something
      return person[key].toLowerCase().includes(value.toLowerCase());
    });
  });

  // Determine which array to render:
  const displayedPeople = isAdvanced ? advancedFilteredPeople : basicFilteredPeople;

  // Handler for advanced search field changes:
  const handleAdvancedChange = (e) => {
    const { name, value } = e.target;
    setAdvancedSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSearchMode = () => {
    setIsAdvanced((prev) => !prev);
    // Reset search states whenever toggling:
    setSearchTerm('');
    setAdvancedSearch({
      name: '',
      title: '',
      person_type: '',
      sector_focus: '',
      company_name: '',
      email: '',
      city: '',
      linkedin: '',
    });
  };

  return (
    <div className="people-page-container">
      <Navbar />
      <div className="people-main-content">

        {/** Toggle for Basic vs. Advanced search */}
        <div className="search-mode-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={isAdvanced}
              onChange={handleToggleSearchMode}
            />
            <span className="slider"></span>
          </label>
          <span className="search-mode-label">
            {isAdvanced ? 'Advanced Search' : 'Basic Search'}
          </span>
        </div>

        {/** Basic search input */}
        {!isAdvanced && (
          <div className="people-controls">
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="people-search-input"
            />
            <button className="people-add-button" onClick={handleAddPerson}>
              Add Person
            </button>
          </div>
        )}

{isAdvanced && (
  <div className="advanced-search-container">
    {/* Optional heading for clarity */}
    <h2 className="advanced-search-heading">Advanced Search</h2>

    <div className="advanced-search-grid">
      <div className="advanced-search-field">
        <label>Name</label>
        <input
          name="name"
          type="text"
          value={advancedSearch.name}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>Title</label>
        <input
          name="title"
          type="text"
          value={advancedSearch.title}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>Type</label>
        <input
          name="person_type"
          type="text"
          value={advancedSearch.person_type}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>Sector</label>
        <input
          name="sector_focus"
          type="text"
          value={advancedSearch.sector_focus}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>Company</label>
        <input
          name="company_name"
          type="text"
          value={advancedSearch.company_name}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>Email</label>
        <input
          name="email"
          type="text"
          value={advancedSearch.email}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>City</label>
        <input
          name="city"
          type="text"
          value={advancedSearch.city}
          onChange={handleAdvancedChange}
        />
      </div>
      <div className="advanced-search-field">
        <label>LinkedIn</label>
        <input
          name="linkedin"
          type="text"
          value={advancedSearch.linkedin}
          onChange={handleAdvancedChange}
        />
      </div>
    </div>

    <div className="advanced-search-actions">
      <button className="people-add-button" onClick={handleAddPerson}>
        Add Person
      </button>
    </div>
  </div>
)}


        <h1>Dream Network</h1>

        {loading && (
          <div className="people-status people-loading">Loading people...</div>
        )}
        {error && (
          <div className="people-status people-error">
            Error fetching people: {error}
          </div>
        )}
        {!loading && !error && displayedPeople.length === 0 && (
          <div className="people-status people-empty">No people found.</div>
        )}

        {!loading && !error && displayedPeople.length > 0 && (
          <div className="people-table-container">
            <table className="people-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Sector</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {displayedPeople.map((person) => (
                  <tr
                    key={person.id}
                    className="people-list-item"
                    onClick={() => handlePersonClick(person)}
                  >
                    <td className="people-name">{person.name || 'N/A'}</td>
                    <td className="people-title">{person.title || 'N/A'}</td>
                    <td className="people-type">
                      {person.person_type?.length > 15
                        ? `${person.person_type.substring(0, 15)}...`
                        : person.person_type || 'N/A'}
                    </td>
                    <td className="people-sector">{person.sector_focus || 'N/A'}</td>
                    <td className="people-company">{person.company_name || 'N/A'}</td>
                    <td className="people-email">{person.email || 'N/A'}</td>
                    <td className="people-city">{person.city || 'N/A'}</td>
                    <td className="people-linkedin">
                      {person.linkedin ? (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn Profile
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedPerson && (
          <PersonModal person={selectedPerson} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default People;
