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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setPeople(data);
      }
      setLoading(false);
    };

    fetchPeople();
  }, []);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };

  const formatDate = (dateString) => {
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredPeople = people.filter(person =>
    person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="people-page-container">
      <Navbar />
      <div className="people-main-content">
        <h1 className="people-title">People</h1>
        <div className="people-controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="people-search-input"
          />
          <button className="people-add-button">Add Person</button>
        </div>

        {loading && (
          <div className="people-status people-loading">Loading people...</div>
        )}
        {error && (
          <div className="people-status people-error">Error fetching people: {error}</div>
        )}
        {!loading && !error && filteredPeople.length === 0 && (
          <div className="people-status people-empty">No people found.</div>
        )}

        {!loading && !error && filteredPeople.length > 0 && (
          <div className="people-table-container">
            <table className="people-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>LinkedIn</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map((person) => (
                  <tr
                    key={person.id}
                    className="people-list-item"
                    onClick={() => handlePersonClick(person)}
                  >
                    <td className="people-name">{person.name}</td>
                    <td className="people-email">{person.email || 'N/A'}</td>
                    <td className="people-title">{person.title || 'N/A'}</td>
                    <td className="people-linkedin">
                      {person.linkedin ? (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn Profile
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="people-date-added">{person.created_at ? formatDate(person.created_at) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {selectedPerson && <PersonModal person={selectedPerson} onClose={handleCloseModal} />}
      </div>
    </div>
  );
}

export default People;
