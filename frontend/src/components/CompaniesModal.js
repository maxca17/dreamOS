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

  // Modals
  const [showDecksModal, setShowDecksModal] = useState(false);
  const [showFoundersModal, setShowFoundersModal] = useState(false);
  const [showInvestorUpdatesModal, setShowInvestorUpdatesModal] = useState(false);
  const [showEquityOpsModal, setShowEquityOpsModal] = useState(false);

  // For Delete
  const [deleteButton, setDeleteButton] = useState(false);

  // NEW: State to handle image preview (for deck files, etc.)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // NEW: For handling logo file uploads
  const [logoFile, setLogoFile] = useState(null);

  // Load company data from DB
  const fetchData = useCallback(async () => {
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
    setLogoFile(null); // Reset the file selection
  };

  const handleSave = async () => {
    try {
      // 1) If user uploaded a new logo, handle Supabase upload
      let updatedLogoUrl = tempData.logo_url || null; // fallback if no new file

      if (logoFile) {
        // Derive file extension
        const fileExt = logoFile.name.split('.').pop();
        // Make a simple name based on the company
        const fileName = `${(tempData.company_name || data.company_name)
          .replace(/\s+/g, '_')}_logo.${fileExt}`;
        const filePath = `logos/${fileName}`;

        // Upload the file (remove unused 'data:' to avoid ESLint warnings)
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(filePath, logoFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: publicUrlData, error: publicUrlError } =
          supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);

        if (publicUrlError) {
          throw publicUrlError;
        }

        updatedLogoUrl = publicUrlData.publicUrl;
      }

      // 2) Update the database record
      const { error } = await supabase
        .from('companies')
        .update({
          // Basic fields
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
          status: tempData.status,
          // Add the updated logo_url
          logo_url: updatedLogoUrl,
          round: tempData.round,
        })
        .eq('company_name', data.company_name);

      if (error) {
        throw error;
      }

      // 3) Re-fetch data, exit edit mode
      await fetchData();
      setIsEditing(false);
      setLogoFile(null);

    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  // Handle changes to editable fields
  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Deletion
  const handleDelete = async () => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('company_name', data.company_name);

    if (error) {
      console.error('Error deleting data:', error);
    } else {
      onClose(); // Close the modal
      if (onDelete) {
        onDelete(); // Refresh parent
      }
    }
  };

  useEffect(() => {
    if (deleteButton) {
      handleDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteButton]);

  // Determine if a file is an image by extension
  const isImageFile = (fileName = '') => {
    return /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName);
  };

  // If it's an image, show a popup; otherwise open in a new tab
  const handleFileClick = (file) => {
    if (isImageFile(file.file_name)) {
      setImagePreviewUrl(file.file_url);
    } else {
      window.open(file.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle changes to the logo file input
  const handleLogoFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

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

                {/* --- LOGO --- */}
                <div className="info-item">
                  <span className="info-label">Company Logo</span>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                      />
                      {logoFile ? (
                        // Preview the newly selected file
                        <img
                          src={URL.createObjectURL(logoFile)}
                          alt="Preview"
                          style={{
                            width: '100px',
                            height: '100px',
                            marginTop: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        // If no new file selected, show the existing logo (if any)
                        data?.logo_url && (
                          <img
                            src={data.logo_url}
                            alt="Current Logo"
                            style={{
                              width: '100px',
                              height: '100px',
                              marginTop: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    // Not editing: show the existing logo or a placeholder
                    data?.logo_url ? (
                      <img
                        src={data.logo_url}
                        alt="Company Logo"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="info-value">No logo uploaded.</span>
                    )
                  )}
                </div>

                {/* COMPANY NAME */}
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

                {/* VALUATION */}
                <div className="info-item">
                  <span className="info-label">Current Valuation</span>
                  {isEditing ? (
                    <input
                      value={
                        tempData?.valuation || tempData?.valuation === 0
                          ? `$${parseFloat(tempData.valuation).toLocaleString()}`
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('valuation', val ? parseFloat(val) : '');
                      }}
                      placeholder="$0.00"
                      style={{ textAlign: 'left' }}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.valuation || data?.valuation === 0
                        ? `$${parseFloat(data.valuation)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        : "N/A"}
                    </span>
                  )}
                </div>

                {/* REVENUE */}
                <div className="info-item">
                  <span className="info-label">Revenue</span>
                  {isEditing ? (
                    <input
                      value={
                        tempData?.revenue
                          ? `$${parseFloat(tempData.revenue).toLocaleString()}`
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        handleChange('revenue', val ? parseFloat(val) : '');
                      }}
                      placeholder="$0.00"
                      style={{ textAlign: 'left' }}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.revenue
                        ? `$${parseFloat(data.revenue)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        : "N/A"}
                    </span>
                  )}
                </div>

                {/* REGION */}
                <div className="info-item">
                  <span className="info-label">Region</span>
                  {isEditing ? (
                    <select
                      value={tempData?.region || ""}
                      onChange={(e) => handleChange('region', e.target.value)}
                    >
                      <option value="">Select Region</option>
                      <option value="USA">USA</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="South America">South America</option>
                      <option value="Africa">Africa</option>
                      <option value="Australia">Australia</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.region || "N/A"}</span>
                  )}
                </div>

                {/* WEBSITE */}
                <div className="info-item">
                  <span className="info-label">Website</span>
                  {isEditing ? (
                    <input
                      value={tempData?.company_website || ""}
                      onChange={(e) => handleChange('company_website', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      <a
                        href={data?.company_website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data?.company_website || "N/A"}
                      </a>
                    </span>
                  )}
                </div>

                {/* CITY */}
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

                {/* STATUS */}
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

                {/* SECTOR */}
                <div className="info-item">
                  <span className="info-label">Primary Sector</span>
                  {isEditing ? (
                    <select
                      value={tempData?.sector || ""}
                      onChange={(e) => handleChange('sector', e.target.value)}
                    >
                      <option value="">Select Sector</option>
                      <option value="Consumer">Consumer</option>
                      <option value="Technology">Technology</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.sector || "N/A"}</span>
                  )}
                </div>

                {/* ONE LINER */}
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

                {/* FUND */}
                <div className="info-item">
                  <span className="info-label">Fund</span>
                  {isEditing ? (
                    <input
                      value={tempData?.fund || ""}
                      onChange={(e) => handleChange('fund', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.fund || "Fund II"}
                    </span>
                  )}
                </div>

                {/* OTHER INVESTORS */}
                <div className="info-item">
                  <span className="info-label">Other Investors</span>
                  {isEditing ? (
                    <input
                      value={tempData?.other_investors || ""}
                      onChange={(e) => handleChange('other_investors', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.other_investors || "None"}
                    </span>
                  )}
                </div>

                {/* WHO REFERRED */}
                <div className="info-item">
                  <span className="info-label">Who Referred?</span>
                  {isEditing ? (
                    <input
                      value={tempData?.who_referred || ""}
                      onChange={(e) => handleChange('who_referred', e.target.value)}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.who_referred || "None"}
                    </span>
                  )}
                </div>

                {/* ROUND */}
                <div className="info-item">
                  <span className="info-label">Round</span>
                  {isEditing ? (
                    <select
                      value={tempData?.round || ""}
                      onChange={(e) => handleChange('round', e.target.value)}
                    >
                      <option value="">Select Round</option>
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
                    <span className="info-value">
                      {data?.round || "N/A"}
                    </span>
                  )}
                </div>

                {/* POC */}
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
                    <span className="info-value">
                      {data?.poc || "None"}
                    </span>
                  )}
                </div>

                {/* OVERVIEW */}
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

                {/* RECENT UPDATE */}
                <div className="info-item overview-full">
                  <span className="info-label">
                    Recent founder update summary ({new Date().toLocaleDateString()})
                  </span>
                  {isEditing ? (
                    <textarea
                      value={tempData?.recent_update || ""}
                      onChange={(e) => {
                        handleChange('recent_update', e.target.value);
                        setTempData((prev) => ({
                          ...prev,
                          recent_update_date: new Date().toLocaleDateString(),
                        }));
                      }}
                    />
                  ) : (
                    <span className="info-value">
                      {data?.recent_update || "Add Updates Here"}
                    </span>
                  )}
                </div>

                {/* WINS */}
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

                {/* ASKS */}
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
            {/* FOUNDERS */}
            <div className="side-card">
              <h4>
                Founders
                <button
                  className="expand-button"
                  style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowFoundersModal(true)}
                >
                  &#x25B6;
                </button>
              </h4>
              <div className="founders-list">
                {(data?.founders || []).length > 0 ? (
                  (data.founders || [])
                    .sort((a, b) => (b.name || '').localeCompare(a.name || ''))
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

            {/* DECKS AND MEMOS */}
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
                      <button
                        className="file-link"
                        onClick={() => handleFileClick(file)}
                      >
                        {file.file_name}
                      </button>
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

            {/* INVESTOR UPDATES */}
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
                          <button
                            className="file-link"
                            onClick={() => {
                              if (isImageFile(update.update_name)) {
                                setImagePreviewUrl(update.update_url);
                              } else {
                                window.open(update.update_url, '_blank', 'noopener,noreferrer');
                              }
                            }}
                          >
                            {nameWithoutExt.length > 20
                              ? `${nameWithoutExt.slice(0, 20)}...${extension}`
                              : update.update_name}
                          </button>
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
                    fetchData();
                  }}
                />
              )}
            </div>

            {/* EQUITY ENTRY OPS */}
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
                  fetchData();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Lightbox */}
      {imagePreviewUrl && (
        <div className="image-preview-modal">
          <div className="image-preview-content">
            <button
              className="close-preview-btn"
              onClick={() => setImagePreviewUrl(null)}
            >
              &times;
            </button>
            <img src={imagePreviewUrl} alt="Preview" className="image-preview-img" />
          </div>
        </div>
      )}

      {/* Decks and Memos Modal */}
      {showDecksModal && (
        <DecksAndMemosModal
          companyName={data.company_name}
          onClose={() => {
            setShowDecksModal(false);
            fetchData();
          }}
        />
      )}

      {/* Founders Modal */}
      {showFoundersModal && (
        <FoundersModal
          companyName={data.company_name}
          onClose={() => {
            setShowFoundersModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default CompaniesModal;
