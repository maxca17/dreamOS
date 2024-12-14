import React, { useState, useEffect } from 'react';
import '../css/components/dashboard.css';
import NavBar from '../constants/Navbar';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [portfolioCompaniestotal, setPortfolioCompaniestotal] = useState([]);
  const [activeCompanies, setActiveCompanies] = useState(0);
  const [exits, setExits] = useState(0);
  const [totalOutofBusiness, setTotalOutofBusiness] = useState(0);



  const fetchTotalOutofBusiness = async () => {
    const { data, error } = await supabase.from('companies').select('*').eq('out_of_business', true);
    if (error) {
      console.error('Error fetching total out of business:', error);
    } else {
      setTotalOutofBusiness(data.length);
    }
  };

  const fetchExits = async () => {
    const { data, error } = await supabase.from('companies').select('*').eq('exit', true);
    if (error) {
      console.error('Error fetching exits:', error);
    } else {
      setExits(data.length);
    }
  };

  const fetchActiveCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('*').eq('active', true);
    if (error) {
      console.error('Error fetching total companies:', error);
    } else {
      setActiveCompanies(data.length);
    }
  };

  const fetchPortfolioCompaniestotal = async () => {
    const { data, error } = await supabase.from('companies').select('*').eq('status', 'Portfolio Company');
    if (error) {
      console.error('Error fetching portfolio companies:', error);
    } else {
      setPortfolioCompaniestotal(data);
    }
  };

  useEffect(() => {
    fetchPortfolioCompaniestotal();
    fetchActiveCompanies();
    fetchExits(); 
    fetchTotalOutofBusiness();
  }, []);

  // Sample data
  const unicorns = [
    { 
      name: 'Rippling', 
      desc: 'Integrated platform to manage employee payroll, benefits, training, devices, and app permissions', 
      location: 'US', 
      category: 'B2B / SaaS', 
      valuation: '+5b Valuation',
      logoColor: '#FFB84D' 
    },
    { 
      name: 'Deel', 
      desc: 'Hiring, payroll & compliance platform for US & global teams', 
      location: 'US', 
      category: 'B2B / SaaS', 
      valuation: '+5b Valuation',
      logoColor: '#000000' 
    },
    { 
      name: 'Ramp', 
      desc: 'Corporate credit card that focuses on helping businesses eliminate overspend', 
      location: 'US', 
      category: 'FinTech', 
      valuation: '+5b Valuation',
      logoColor: '#FFFF00'
    },
    { 
      name: 'Razorpay', 
      desc: 'Payment solution in India that allows businesses to accept, process and disburse online transactions', 
      location: 'India', 
      category: 'FinTech', 
      valuation: '+5b Valuation',
      logoColor: '#007BFF'
    },
    { 
      name: 'Rappi', 
      desc: 'On demand delivery in Latin America.', 
      location: 'LatAm', 
      category: 'Consumer', 
      valuation: '+5b Valuation',
      logoColor: '#FF6633'
    },
    { 
      name: 'Truebill', 
      desc: 'Leading personal finance app with a mission to empower people to live their best financial lives.', 
      location: 'US', 
      category: 'Consumer', 
      valuation: '1-5b Valuation',
      logoColor: '#9900FF'
    },
  ];

  const news = [
    { title: 'The most active investors in generative AI', year: '2024' },
    { title: 'The Midas Seed List - Aneel Ranadive', year: '2024' },
    { title: "Y Combinator's Investment Syndicate Map: Who backs the most YC startups?", year: '2023' },
    { title: 'Pitchbook League Tables', year: '2023' },
    { title: 'Most Active US Investors: Deals Trickle In As Gaingels And Soma Capital Lead', year: '2023' },
    { title: 'Seed 75: The best seed VC firms for founders looking to raise money in 2023', year: '2023' },
  ];

  const investments = [
    { name: 'Cathedral Therapeutics', date: '12/12/2024' },
    { name: 'OpenClinic', date: '12/08/2024' },
    { name: 'Industrials, Inc.', date: '11/19/2024' },
    { name: 'Decagon', date: '10/13/2024' },
    { name: 'Chapter One', date: '10/10/2024' }
  ];

  return (
    <div className="dashboard-container">
      <NavBar />
      <div className="main-content">
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, Aryan Bhatnagar</h2>
            <p>To the Dream Ventures Platform</p>
          </div>
          <div className="metrics">
            <div className="metric-item">
              <strong>{portfolioCompaniestotal.length}</strong>
              <span>Total Investments</span>
            </div>
            <div className="metric-item">
              <strong>{activeCompanies}</strong>
              <span>Active Investments</span>
            </div>
            <div className="metric-item">
              <strong>{exits}</strong>
              <span>Exits</span>
            </div>
            <div className="metric-item">
              <strong>{totalOutofBusiness}</strong>
              <span>Out of Business</span>
            </div>
            <div className="metric-item">
              <strong>56300+</strong>
              <span>Markups</span>
            </div>
            <div className="metric-item">
              <strong>10700+</strong>
              <span>Average Check Size</span>
            </div>
            <div className="metric-item">
              <strong>10700+</strong>
              <span>Total Capital Deployed</span>
            </div>
          </div>
          {/* <div className="actions">
            <button className="discover-btn">Discover a top company</button>
            <button className="recommend-btn">Recommend a company</button>
          </div> */}
        </div>

        <div className="content-sections">
          <div className="unicorns-section">
            <h3>Dream Top Unicorn Breakouts</h3>
            <ul className="unicorn-list">
              {unicorns.map((u, index) => (
                <li key={index} className="unicorn-item">
                  <div className="unicorn-logo" style={{ backgroundColor: u.logoColor }}>
                  </div>
                  <div className="unicorn-info">
                    <h4>{u.name}</h4>
                    <p>{u.desc}</p>
                  </div>
                  <div className="unicorn-meta">
                    <span className="meta-location">{u.location}</span>
                    <span className="meta-category">{u.category}</span>
                    <span className="meta-valuation">{u.valuation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-content">
            <div className="news-section">
              <h4>Soma in the news</h4>
              <ul className="news-list">
                {news.map((n, idx) => (
                  <li key={idx}>
                    <span className="news-title">{n.title}</span>
                    <span className="news-year">{n.year}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="investments-section">
              <h4>Recent Investments</h4>
              <ul className="investments-list">
                {investments.map((inv, i) => (
                  <li key={i}>
                    <span className="inv-name">{inv.name}</span>
                    <span className="inv-date">{inv.date}</span>
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

export default Dashboard;
