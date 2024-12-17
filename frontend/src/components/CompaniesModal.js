import React, { useState, useEffect, useCallback } from 'react';
import '../css/components/companiesmodal.css';
import { supabase } from '../supabaseClient'

const CompaniesModal = ({ company, onClose }) => {
  const [data, setData] = useState(company);
  const [tempData, setTempData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: companyData, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_name', company.company_name)

    if (error) {
      console.error('Error fetching data:', error);
    } else if (companyData && companyData.length > 0) {
      setData(companyData[0]);
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
    // Update the database with tempData
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
        asks: tempData.asks
      })
      .eq('company_name', data.company_name);

    if (error) {
      console.error('Error updating data:', error);
    } else {
      setData(tempData);
      setIsEditing(false);
    }
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Hardcoded data for demonstration
  const founders = [
    {
      name: "Alex Bouaziz",
      linkedIn: "https://www.linkedin.com/in/alexbouaziz/",
      img: "https://placehold.co/50x50?text=AB",
      icon: "https://placehold.co/16x16?text=IN"
    },
    {
      name: "Shuo Wang",
      linkedIn: "https://www.linkedin.com/in/shuo-wang-848a/",
      img: "https://placehold.co/50x50?text=SW",
      icon: "https://placehold.co/16x16?text=IN"
    }
  ];

  const decksAndMemos = [
    { title: "Deel - one pager.pdf", date: "05/26/2023", link: "#" },
    { title: "Deel Notes.pdf", date: "05/26/2023", link: "#" }
  ];

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
                        const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
                        handleChange('valuation', value);
                      }}
                      placeholder="$0.00"
                    />
                  ) : (
                    <span className="info-value">
                      {data?.valuation ? `$${parseFloat(data.valuation).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "N/A"}
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
                      <option value="Closed">Portfolio Company</option>
                    </select>
                  ) : (
                    <span className="info-value">{data?.status || "N/A"}</span>
                  )}
                </div>

                <div className="info-item">
                  <span className="info-label">Primary Sector</span>
                  {isEditing ? (
                    <input
                      value={tempData?.sector || ""}
                      onChange={(e) => handleChange('sector', e.target.value)}
                    />
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
                  <span className="info-label">Stage</span>
                  {isEditing ? (
                    <select
                      value={tempData?.stage || ""}
                      onChange={(e) => handleChange('stage', e.target.value)}
                    >
                      <option value="">Select Stage</option>
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
                        // Update the date when the recent update is changed
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
            <div className="side-card">
              <h4>Founders</h4>
              <div className="founders-list">
                {founders.map((f, idx) => (
                  <div className="founder-item" key={idx}>
                    <img src={f.img} alt={f.name} className="founder-img"/>
                    <div className="founder-info">
                      <div className="founder-name">{f.name}</div>
                      <a href={f.linkedIn} target="_blank" rel="noopener noreferrer"><img src={f.icon} alt="LinkedIn" /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-card">
              <h4>Decks and Memos</h4>
              <ul className="docs-list">
                {decksAndMemos.map((d, i) => (
                  <li key={i}>
                    <a href={d.link}>{d.title}</a>
                    <span className="doc-date">{d.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="side-card">
              <h4>Investor Updates</h4> {/* TODO: Add investor updates modal */}
            </div>

            <div className="side-card">
              <h4>Equity Entry Ops</h4> {/* TODO: Add entry setion popup modal  */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompaniesModal;
