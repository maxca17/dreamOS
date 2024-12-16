import React, { useState, useEffect } from 'react';
import '../css/components/companiesmodal.css';
import { supabase } from '../supabaseClient'

const CompaniesModal = ({ company, onClose }) => {
  const [data, setData] = useState(company);

  const fetchData = async () => {
    const { data: companyData, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_name', company.company_name);

    if (error) {
      console.error('Error fetching data:', error);
    } else if (companyData && companyData.length > 0) {
      setData(companyData[0]);
    }
  };

  useEffect(() => {
    if (company && company.company_name) {
      fetchData();
    }
  }, [company]);

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

  const recentNews = [
    { title: "Have the rules of etiquette changed in today's world of work?", date: "11/27/2024", link: "#" },
    { title: "Deel Expands Immigration Support To Everyone, Streamlining Global Visa Applications", date: "10/23/2024", link: "#" },
    { title: "Deel Expands Immigration Support To Everyone, Streamlining Global Visa Applications", date: "10/22/2024", link: "#" }
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
                <button className="pdf-button">Edit</button>
              </div>
              <div className="company-info-grid">
              <div className="info-item">
                  <span className="info-label">Company Name</span>
                  <span className="info-value">{data?.company_name || "Deel"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Valuation</span>
                  <span className="info-value">{data?.valuation || "+5b Series D"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Revenue</span>
                  <span className="info-value">{data?.revenue || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Region</span>
                  <span className="info-value">{data?.region || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Website</span>
                  <span className="info-value">
                    <a href={data?.company_website || "N/A"} target="_blank" rel="noopener noreferrer">
                      {data?.company_website || "N/A"}
                    </a>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">City</span>
                  <span className="info-value">{data?.city || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Primary Sector</span>
                  <span className="info-value">{data?.primary_sector || "B2B / SaaS"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Other Sector</span>
                  <span className="info-value">{data?.other_sector || "Female Founders, FinTech, DevTools"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">One Liner</span>
                  <span className="info-value">{data?.one_liner || "hiring, payroll & compliance platform for US & global teams"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fund</span>
                  <span className="info-value">{data?.fund || "Fund II"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Other Investors</span>
                  <span className="info-value">{data?.other_investors || "Spark Capital, a16z, YC Continuity, ESAS Ventures"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">YC Class</span>
                  <span className="info-value">{data?.yc_class || "W19"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Investment Evaluation (estimated)</span>
                  <span className="info-value">{data?.investment_evaluation || "1598"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Soma ranking</span>
                  <span className="info-value">{data?.soma_ranking || "1"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Founder Linkedins</span>
                  <span className="info-value">
                    <a href="https://www.linkedin.com/in/alexbouaziz/" target="_blank" rel="noopener noreferrer">Alex Bouaziz</a> / 
                    <a href="https://www.linkedin.com/in/shuo-wang-848a/" target="_blank" rel="noopener noreferrer"> Shuo Wang</a>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Entry Cost</span>
                  <span className="info-value">{data?.entry_cost || "$250K"}</span>
                </div>
                <div className="info-item overview-full">
                  <span className="info-label">Overview</span>
                  <span className="info-value">
                    {data?.overview ||
                      "Deel is every business' wish come true for onboarding and training the 20 million international contractors who work with US companies. By handling all contracts, payments, and taxes in one interface, Deel eliminates paperwork and frees up time for businesses to focus on their most pressing needs."}
                  </span>
                </div>
                <div className="info-item overview-full">
                  <span className="info-label">Recent founder update summary (06/18/2024)</span>
                  <span className="info-value">
                    {data?.recent_update ||
                      "Deel has launched Deel AI to its 25,000+ customers, enhancing global HR capabilities with data-driven insights and compliance information. Following the acquisition of Zavvy, Deel has integrated and launched it as Deel Engage, a comprehensive talent development product."}
                  </span>
                </div>
                <div className="info-item overview-full">
                  <span className="info-label">Wins</span>
                  <span className="info-value">
                    {data?.wins ||
                      "• Launch of Deel AI to 25,000+ customers.  \n• Integration and Launch of Zavvy acquisition as Deel Engage."}
                  </span>
                </div>
                <div className="info-item overview-full">
                  <span className="info-label">Asks</span>
                  <span className="info-value">
                    {data?.asks ||
                      "Looking for introductions to HR and payroll queries experts, and exploring partnerships in new markets."}
                  </span>
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
              <h4>Recent News</h4>
              <ul className="news-list">
                {recentNews.map((n, idx) => (
                  <li key={idx}>
                    <a href={n.link}>{n.title}</a>
                    <span className="news-date">{n.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompaniesModal;
