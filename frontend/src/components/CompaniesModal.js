import React, { useState, useEffect, useCallback } from 'react';
import '../css/components/companiesmodal.css';
import { supabase } from '../supabaseClient';
import DecksAndMemosModal from './DecksAndMemosModal';
import FoundersModal from './FoundersModal';
import InvestorUpdatesModal from './InvestorUpdatesModal';
import EquityOpsModal from './EquityOpsModal';

const CompaniesModal = ({ company, onClose, onDelete }) => {
  const [data, setData] = useState(company);
  const [tempData, setTempData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showDecksModal, setShowDecksModal] = useState(false);
  const [showFoundersModal, setShowFoundersModal] = useState(false); // ADDED: To control FoundersModal visibility
  const [showInvestorUpdatesModal, setShowInvestorUpdatesModal] = useState(false); // ADDED: To control InvestorUpdatesModal visibility
  const [showEquityOpsModal, setShowEquityOpsModal] = useState(false); // ADDED: To control EquityOpsModal visibility
  const [deleteButton, setDeleteButton] = useState(false); // ADDED: To control DeleteModal visibility
  const fetchData = useCallback(async () => {

    // Fetch company data from the database
    const { data: companyData, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_name', company.company_name)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
    } else if (companyData) {
      setData(companyData);
    }
  }, [company.company_name]);

  useEffect(() => {
    if (company && company.company_name) {
      fetchData();
    }
  }, [company, fetchData]);

  const handleEdit = () => {
    setTempData(data);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('companies')
      .update({
        company_name: tempData.company_name,
        valuation: tempData.valuation,
        revenue: tempData.revenue,
        region: tempData.region,
        company_website: tempData.company_website,
        city: tempData.city,
        sector: tempData.sector,
        one_liner: tempData.one_liner,
        fund: tempData.fund,
        other_investors: tempData.other_investors,
        stage: tempData.stage,
        overview: tempData.overview,
        recent_update: tempData.recent_update,
        wins: tempData.wins,
        asks: tempData.asks,
        poc: tempData.poc,
        who_referred: tempData.who_referred,
        status: tempData.status
      })
      .eq('company_name', data.company_name);

    if (error) {
      console.error('Error updating data:', error);
    } else {
      setData(tempData);
      setIsEditing(false);
      fetchData(); // re-fetch to ensure we have updated data
    }
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('companies').delete().eq('company_name', data.company_name);
    if (error) {
      console.error('Error deleting data:', error);
    } else {
      onClose(); // Close the modal after deletion
      if (onDelete) {
        onDelete(); // Trigger parent component to refresh data
      }
    }
  };

  useEffect(() => {
    if (deleteButton) {
      handleDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteButton]);

  return (
    <div className="companies-modal-overlay">
      <div className="companies-modal-content">
        <button className="companies-modal-close" onClick={onClose}>×</button>

        <div className="companies-modal-grid">
          {/* LEFT COLUMN */}
          <div className="companies-modal-left">
            <div className="company-info-card">
              <div className="company-info-header">
                <h3>Company Information</h3>
                {!isEditing && (
                  <button className="pdf-button" onClick={handleEdit}>Edit</button>
                  
                )}
                {isEditing && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="pdf-button" onClick={handleSave}>Save</button>
                    <button className="pdf-button" onClick={() => setDeleteButton(true)}>Delete</button>
                    <button className="pdf-button" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
              <div className="company-info-grid">
                <div className="info-item">
                  <span className="info-label">Company Name</span>
                  {isEditing ? (
                    <input
                      value={tempData?.company_name || ""}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.company_name || "Deel"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Current Valuation</span>
                  {isEditing ? (
                    <input
                      value={tempData?.valuation || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('valuation', value);
                      }}
                      placeholder="$0.00"
                    />
                  ) : (
                    <span className="info-value">
                      {data?.valuation
                        ? `$${parseFloat(data.valuation).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        : "N/A"}
                    </span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Revenue</span>
                  {isEditing ? (
                    <input
                      value={tempData?.revenue || ""}
                      onChange={(e) => handleChange('revenue', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.revenue || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Region</span>
                  {isEditing ? (
                    <input
                      value={tempData?.region || ""}
                      onChange={(e) => handleChange('region', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.region || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Website</span>
                  {isEditing ? (
                    <input
                      value={tempData?.company_website || ""}
                      onChange={(e) => handleChange('company_website', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      <a href={data?.company_website || "#"} target="_blank" rel="noopener noreferrer">
                        {data?.company_website || "N/A"}
                      </a>
                    </span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">City</span>
                  {isEditing ? (
                    <input
                      value={tempData?.city || ""}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.city || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Status</span>
                  {isEditing ? (
                    <select
                      value={tempData?.status || ""}
                      onChange={(e) => handleChange('status', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="Portfolio Company">Portfolio Company</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.status || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Primary Sector</span>
                  {isEditing ? (
                    <select
                      value={tempData?.sector || ""}
                      onChange={(e) => handleChange('sector', e.target.value)}
                    >
                      <option value="">Select Sector</option>
                      <option value="CPG">CPG</option>
                      <option value="FinTech">FinTech</option>
                      <option value="Venture Capital">Venture Capital</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.sector || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">One Liner</span>
                  {isEditing ? (
                    <input
                      value={tempData?.one_liner || ""}
                      onChange={(e) => handleChange('one_liner', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.one_liner || ""}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Fund</span>
                  {isEditing ? (
                    <input
                      value={tempData?.fund || ""}
                      onChange={(e) => handleChange('fund', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.fund || "Fund II"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Other Investors</span>
                  {isEditing ? (
                    <input
                      value={tempData?.other_investors || ""}
                      onChange={(e) => handleChange('other_investors', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.other_investors || "None"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Who Referred?</span>
                  {isEditing ? (
                    <input
                      value={tempData?.who_referred || ""}
                      onChange={(e) => handleChange('who_referred', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">{data?.who_referred || "None"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Stage</span>
                  {isEditing ? (
                    <select
                      value={tempData?.stage || ""}
                      onChange={(e) => handleChange('stage', e.target.value)}
                    >
                      <option value="">Select Stage</option>
                      <option value="None">None</option>
                      <option value="Pre-seed">Pre-seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                      <option value="Series D">Series D</option>
                      <option value="Series E">Series E</option>
                      <option value="IPO">IPO</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.stage || "Series D"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">POC</span>
                  {isEditing ? (
                    <select
                      value={tempData?.poc || ""}
                      onChange={(e) => handleChange('poc', e.target.value)}
                    >
                      <option value="">Select POC</option>
                      <option value="Richard">Richard</option>
                      <option value="Jonah">Jonah</option>
                      <option value="Aryan">Aryan</option>
                      <option value="None">None</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.poc || "None"}</span>
                  )}
                </div>

                <div className="info-item overview-full">
                  <span className="info-label">Overview</span>
                  {isEditing ? (
                    <textarea
                      value={tempData?.overview || ""}
                      onChange={(e) => handleChange('overview', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.overview || "Add Overview Here"}
                    </span>
                  )}
                </div>

                <div className="info-item overview-full">
                  <span className="info-label">Recent founder update summary ({new Date().toLocaleDateString()})</span>
                  {isEditing ? (
                    <textarea
                      value={tempData?.recent_update || ""}
                      onChange={(e) => {
                        handleChange('recent_update', e.target.value);
                        setTempData((prev) => ({ ...prev, recent_update_date: new Date().toLocaleDateString() }));
                      }}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.recent_update || "Add Updates Here"}
                    </span>
                  )}
                </div>

                <div className="info-item overview-full">
                  <span className="info-label">Wins</span>
                  {isEditing ? (
                    <textarea
                      value={tempData?.wins || ""}
                      onChange={(e) => handleChange('wins', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.wins || "Add Wins Here"}
                    </span>
                  )}
                </div>

                <div className="info-item overview-full">
                  <span className="info-label">Asks</span>
                  {isEditing ? (
                    <textarea
                      value={tempData?.asks || ""}
                      onChange={(e) => handleChange('asks', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.asks || "Add Asks Here"}
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="companies-modal-right">
            {/* FOUNDERS CARD */}
            {/* CHANGED: Use data?.founders (from DB) and add a button to open FoundersModal */}
            <div className="side-card">
              <h4>
                Founders
                <button
                  className="expand-button"
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowFoundersModal(true)} // SHOW FOUNDERS MODAL
                >
                  &#x25B6;
                </button>
              </h4>
              <div className="founders-list">
                {(data?.founders || []).length > 0 ? (
                  (data.founders || [])
                    .sort((a, b) => b.name ? b.name.localeCompare(a.name) : -1) // Sort founders Z-A, handling potential undefined names
                    .map((f, idx) => (
                      <div className="founder-item" key={idx}>
                        <div className="founder-info">
                          <div className="founder-name">{f.name}</div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No founders added yet.</p>
                )}
              </div>
            </div>

            <div className="side-card">
              <h4>
                Decks and Memos
                <button
                  className="expand-button"
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowDecksModal(true)}
                >
                  &#x25B6;
                </button>
              </h4>
              {data?.files && data.files.length > 0 ? (
                <ul className="docs-list">
                  {data.files.map((file, i) => (
                    <li key={i}>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">{file.file_name}</a>
                      <span className="doc-date">
                        {new Date(file.upload_date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No files uploaded yet.</p>
              )}
            </div>

            <div className="side-card">
              <h4>
                Investor Updates
                <button
                  className="expand-button"
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowInvestorUpdatesModal(true)}
                >
                  &#x25B6;
                </button>
              </h4>
              {data?.investor_updates && data.investor_updates.length > 0 ? (
                <ul className="docs-list">
                  {data.investor_updates
                    .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
                    .slice(0, 3)
                    .map((update, i) => {
                      const extension = update.update_name.split('.').pop();
                      const nameWithoutExt = update.update_name.split('.').slice(0, -1).join('.');
                      return (
                        <li key={i}>
                          <a href={update.update_url} target="_blank" rel="noopener noreferrer">
                            {nameWithoutExt.length > 20 
                              ? `${nameWithoutExt.slice(0, 20)}...${extension}`
                              : update.update_name}
                          </a>
                          <span className="doc-date">
                            {new Date(update.upload_date).toLocaleDateString()}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p>No investor updates uploaded yet.</p>
              )}

              {showInvestorUpdatesModal && (
                <InvestorUpdatesModal
                  companyName={data.company_name} 
                  onClose={() => {
                    setShowInvestorUpdatesModal(false);
                    fetchData(); // Fetch updated data when modal closes
                  }}
                />
              )}
            </div>


            <div className="side-card">
              <h4>
                Equity Entry Ops
                <button
                  className="expand-button"
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowEquityOpsModal(true)}
                >
                  &#x25B6;
                </button>
              </h4>
              {(data?.equity_offers && data.equity_offers.length > 0) ? (
                <ul className="docs-list">
                  {data.equity_offers.map((offer, i) => (
                    <li key={i}>
                      {offer.round_type}: {offer.invested_amount} at {offer.valuation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No offers added yet.</p>
              )}
            </div>

{showEquityOpsModal && (
  <EquityOpsModal
    companyName={data.company_name}
    onClose={() => {
      setShowEquityOpsModal(false);
      fetchData(); // refresh company data after closing modal
    }}
  />
)}
          </div>
        </div>
      </div>

      {showDecksModal && (
        <DecksAndMemosModal
          companyName={data.company_name}
          onClose={() => {
            setShowDecksModal(false);
            fetchData(); // Fetch updated data when modal closes
          }}
        />
      )}

      {/* ADDED: Show the FoundersModal when showFoundersModal is true */}
      {showFoundersModal && (
        <FoundersModal
          companyName={data.company_name}
          onClose={() => {
            setShowFoundersModal(false);
            fetchData(); // Fetch updated data when modal closes
          }}
        />
      )}
    </div>
  );
};

export default CompaniesModal;
