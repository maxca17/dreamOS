import React from 'react';
import '../css/components/companies.css';
import NavBar from '../constants/Navbar';

const Companies = () => {
  const companies = [
    { 
      name: 'Rippling',
      desc: 'Integrated platform to manage employee payroll, benefits, training, devices, and app permissions',
      region: 'US',
      industry: 'B2B / SaaS',
      ranking: '1',
      investmentDate: '3/28/2017',
      valuation: '+5b',
      logoColor: '#FFB84D'
    },
    {
      name: 'Deel',
      desc: 'Hiring, payroll & compliance platform for US & global teams',
      region: 'US',
      industry: 'B2B / SaaS',
      ranking: '1',
      investmentDate: '2/12/2019',
      valuation: '+5b',
      logoColor: '#000000'
    },
    {
      name: 'Ramp',
      desc: 'Corporate credit card that focuses on helping businesses eliminate overspend',
      region: 'US',
      industry: 'FinTech',
      ranking: '1',
      investmentDate: '4/7/2020',
      valuation: '+5b',
      logoColor: '#FFFF00'
    },
    {
      name: 'Razorpay',
      desc: 'Payment solution in India that allows businesses to accept, process and disburse online transactions',
      region: 'India',
      industry: 'FinTech',
      ranking: '1',
      investmentDate: '4/2/2015',
      valuation: '+5b',
      logoColor: '#007BFF'
    },
    {
      name: 'Rappi',
      desc: 'On demand delivery in Latin America.',
      region: 'LatAm',
      industry: 'Consumer',
      ranking: '2',
      investmentDate: '3/30/2016',
      valuation: '+5b',
      logoColor: '#FF6633'
    },
    {
      name: 'Imbue',
      desc: 'We build AI systems that can reason',
      region: 'US',
      industry: 'B2B / SaaS',
      ranking: '1',
      investmentDate: '8/12/2021',
      valuation: '1-5b',
      logoColor: '#FF8FB2'
    },
    {
      name: 'Zepto',
      desc: 'Indian Q-Commerce platform.',
      region: 'India',
      industry: 'Consumer',
      ranking: '1',
      investmentDate: '12/19/2021',
      valuation: '1-5b',
      logoColor: '#8F00FF'
    },
    {
      name: 'Human Interest',
      desc: '401(k) provider for SMBs',
      region: 'US',
      industry: 'B2B / SaaS',
      ranking: '1',
      investmentDate: '9/16/2015',
      valuation: '1-5b',
      logoColor: '#00DD99'
    },
    {
      name: 'Jeeves',
      desc: 'All-in-one financial stack for growing businesses globally',
      region: 'LatAm',
      industry: 'FinTech',
      ranking: '1',
      investmentDate: '2/27/2022',
      valuation: '1-5b',
      logoColor: '#FFC0CB'
    }
  ];

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

        <div className="filters-section">
          <h4>Activities</h4>
          <label><input type="checkbox" /> Top Activities</label>
          <label><input type="checkbox" /> Video Calls</label>
          <label><input type="checkbox" /> News</label>
          <label><input type="checkbox" /> Founder Monthly Email</label>
          <label><input type="checkbox" /> Social</label>
          <label><input type="checkbox" /> Ranking</label>
          <label><input type="checkbox" /> Announcements</label>
          <a href="#" className="more-link">Show other activities</a>
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
            />
            <button className="tag-filter">Portfolio</button>

            <div className="sort-dropdown">
              <button className="sort-btn">Valuation ▼</button>
            </div>
          </div>

          <div className="companies-table-container">
            <div className="companies-table-header">
              <div className="header-left">
                <span>Company</span> <span className="count">({companies.length})</span>
              </div>
              <div className="header-right">
                <span>Region</span>
                <span>Industry</span>
                <span>Ranking</span>
                <span>Investment Date</span>
                <span>Valuation</span>
              </div>
            </div>
            <ul className="companies-list">
              {companies.map((c, index) => (
                <li key={index} className="company-row">
                  <div className="company-info">
                    <div className="company-logo" style={{ backgroundColor: c.logoColor }}></div>
                    <div className="company-text">
                      <strong>{c.name}</strong>
                      <p>{c.desc}</p>
                    </div>
                  </div>
                  <div className="company-meta">
                    <span>{c.region}</span>
                    <span>{c.industry}</span>
                    <span>{c.ranking}</span>
                    <span>{c.investmentDate}</span>
                    <span>{c.valuation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Companies;
