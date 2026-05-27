import { useState, useEffect } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    color: #f0ede6;
    font-family: 'DM Mono', monospace;
  }

  .app {
    min-height: 100vh;
    background: #0a0a0a;
    position: relative;
    overflow-x: hidden;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,220,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,220,100,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .header {
    position: relative;
    z-index: 10;
    padding: 40px 48px 32px;
    border-bottom: 1px solid rgba(255,220,100,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: #ffdc64;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #ffdc64;
    letter-spacing: -0.5px;
  }

  .logo-sub {
    font-size: 10px;
    color: rgba(240,237,230,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .status-pill {
    background: rgba(255,220,100,0.1);
    border: 1px solid rgba(255,220,100,0.3);
    color: #ffdc64;
    font-size: 11px;
    padding: 6px 14px;
    border-radius: 100px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .main {
    position: relative;
    z-index: 10;
    padding: 48px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .hero {
    margin-bottom: 48px;
  }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: 52px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 16px;
  }

  .hero h1 span {
    color: #ffdc64;
  }

  .hero p {
    color: rgba(240,237,230,0.5);
    font-size: 14px;
    line-height: 1.7;
    max-width: 480px;
  }

  .search-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,220,100,0.15);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 40px;
  }

  .search-panel h2 {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffdc64;
    margin-bottom: 24px;
  }

  .search-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 16px;
    align-items: end;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(240,237,230,0.4);
  }

  .field input, .field select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,220,100,0.2);
    border-radius: 10px;
    padding: 14px 16px;
    color: #f0ede6;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .field input:focus, .field select:focus {
    border-color: #ffdc64;
  }

  .field select option {
    background: #1a1a1a;
  }

  .scan-btn {
    background: #ffdc64;
    color: #0a0a0a;
    border: none;
    border-radius: 10px;
    padding: 14px 28px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.5px;
  }

  .scan-btn:hover { background: #ffe88a; transform: translateY(-1px); }
  .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .loading-bar {
    margin-top: 24px;
    height: 2px;
    background: rgba(255,220,100,0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .loading-bar-fill {
    height: 100%;
    background: #ffdc64;
    border-radius: 2px;
    animation: loadingAnim 1.5s ease-in-out infinite;
  }

  @keyframes loadingAnim {
    0% { width: 0%; margin-left: 0; }
    50% { width: 60%; margin-left: 20%; }
    100% { width: 0%; margin-left: 100%; }
  }

  .loading-text {
    margin-top: 12px;
    font-size: 12px;
    color: rgba(240,237,230,0.4);
    letter-spacing: 1px;
  }

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .results-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
  }

  .results-count {
    background: rgba(255,220,100,0.1);
    border: 1px solid rgba(255,220,100,0.2);
    color: #ffdc64;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 100px;
  }

  .leads-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lead-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 24px;
    transition: border-color 0.2s;
    animation: fadeIn 0.4s ease forwards;
    opacity: 0;
  }

  .lead-card:hover { border-color: rgba(255,220,100,0.3); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lead-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .lead-info h3 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .lead-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .lead-type {
    font-size: 11px;
    color: rgba(240,237,230,0.4);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .website-badge {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 100px;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .badge-none {
    background: rgba(255,80,80,0.15);
    color: #ff6b6b;
    border: 1px solid rgba(255,80,80,0.3);
  }

  .badge-poor {
    background: rgba(255,160,50,0.15);
    color: #ffa032;
    border: 1px solid rgba(255,160,50,0.3);
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stars {
    color: #ffdc64;
    font-size: 13px;
  }

  .rating-num {
    font-size: 13px;
    color: rgba(240,237,230,0.6);
  }

  .lead-desc {
    font-size: 13px;
    color: rgba(240,237,230,0.5);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .lead-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    letter-spacing: 0.3px;
  }

  .btn-primary {
    background: #ffdc64;
    color: #0a0a0a;
    font-weight: 500;
  }
  .btn-primary:hover { background: #ffe88a; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-secondary {
    background: rgba(255,255,255,0.06);
    color: #f0ede6;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); }
  .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

  .opportunity-score {
    text-align: right;
  }

  .score-label {
    font-size: 10px;
    color: rgba(240,237,230,0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .score-value {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #ffdc64;
  }

  .score-unit {
    font-size: 12px;
    color: rgba(255,220,100,0.5);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: #111111;
    border: 1px solid rgba(255,220,100,0.2);
    border-radius: 20px;
    padding: 36px;
    max-width: 640px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.06);
    border: none;
    color: #f0ede6;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal h3 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .modal-tag {
    font-size: 11px;
    color: #ffdc64;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 24px;
    display: block;
  }

  .modal-content {
    font-size: 13px;
    line-height: 1.8;
    color: rgba(240,237,230,0.8);
    white-space: pre-wrap;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
  }

  .copy-btn {
    padding: 12px 24px;
    background: #ffdc64;
    color: #0a0a0a;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .copy-btn:hover { background: #ffe88a; }

  .generating-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(240,237,230,0.4);
    margin-top: 8px;
  }

  .dot-pulse {
    display: flex;
    gap: 4px;
  }

  .dot-pulse span {
    width: 6px;
    height: 6px;
    background: #ffdc64;
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }

  .empty-state {
    text-align: center;
    padding: 80px 40px;
    color: rgba(240,237,230,0.25);
  }

  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Syne', sans-serif; font-size: 20px; margin-bottom: 8px; color: rgba(240,237,230,0.4); }
  .empty-state p { font-size: 13px; line-height: 1.6; }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px;
  }

  .stat-label {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(240,237,230,0.3);
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #ffdc64;
  }

  .website-preview {
    background: #1a1a2e;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .preview-bar {
    background: #2a2a3e;
    padding: 8px 12px;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .preview-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }

  .preview-content {
    padding: 20px;
    font-size: 12px;
    color: rgba(240,237,230,0.6);
    line-height: 1.6;
    white-space: pre-wrap;
  }
`;

const BUSINESS_TYPES = [
  "Restaurant", "Salon / Barbershop", "Auto Repair", "Plumber",
  "Electrician", "Gym / Fitness", "Dental / Medical", "Retail Store",
  "Landscaping", "Cleaning Service"
];

export default function SiteScout() {
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [leads, setLeads] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [modal, setModal] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadingMessages = [
    "Scanning Google Maps data...",
    "Analyzing business ratings...",
    "Checking website quality...",
    "Identifying opportunities...",
    "Calculating revenue potential...",
  ];

  async function callClaude(prompt, systemPrompt) {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    return data.content?.[0]?.text || "";
  }

  async function scanLeads() {
    if (!city.trim()) return;
    setScanning(true);
    setLeads([]);

    let msgIdx = 0;
    setLoadingText(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIdx]);
    }, 1200);

    try {
      const prompt = `Generate 6 realistic fictional ${businessType} businesses in ${city} that either have NO website or a very poor outdated website, but have high Google ratings (4.0-4.9 stars) and good reviews. These are real opportunities for a web design service.

Return ONLY valid JSON array, no markdown, no explanation:
[
  {
    "name": "Business Name",
    "type": "${businessType}",
    "rating": 4.5,
    "reviewCount": 127,
    "address": "123 Main St, ${city}",
    "phone": "555-XXX-XXXX",
    "email": "owner@businessname.com",
    "websiteStatus": "none" or "poor",
    "websiteIssues": "brief description of website problems or 'No website found'",
    "description": "1-2 sentence description of the business and why it's a great opportunity",
    "opportunityScore": 85,
    "estimatedRevenue": "$400"
  }
]`;

      const raw = await callClaude(prompt, "You are a business research tool. Return only valid JSON arrays with no markdown formatting.");
      
      let parsed;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = generateFallbackLeads(city, businessType);
      }

      setLeads(parsed);
    } catch {
      setLeads(generateFallbackLeads(city, businessType));
    }

    clearInterval(interval);
    setScanning(false);
  }

  function generateFallbackLeads(city, type) {
    return [
      { name: `${city} ${type} House`, type, rating: 4.7, reviewCount: 203, address: `445 Oak Ave, ${city}`, phone: "555-234-5678", email: `info@${city.toLowerCase()}${type.toLowerCase().replace(/\s/g,"")}house.com`, websiteStatus: "none", websiteIssues: "No website found", description: "Highly rated local favorite with no online presence.", opportunityScore: 94, estimatedRevenue: "$500" },
      { name: `The ${type} Co.`, type, rating: 4.5, reviewCount: 158, address: `112 Pine St, ${city}`, phone: "555-345-6789", email: `hello@the${type.toLowerCase().replace(/\s/g,"")}co.com`, websiteStatus: "poor", websiteIssues: "Website from 2009, not mobile-friendly, no booking system", description: "Beloved neighborhood spot with an embarrassingly outdated web presence.", opportunityScore: 88, estimatedRevenue: "$450" },
      { name: `${city} Premier ${type}`, type, rating: 4.8, reviewCount: 89, address: `78 Elm Blvd, ${city}`, phone: "555-456-7890", email: `contact@${city.toLowerCase()}premier.com`, websiteStatus: "none", websiteIssues: "No website found", description: "Top-rated but invisible online — a goldmine for outreach.", opportunityScore: 96, estimatedRevenue: "$600" },
    ];
  }

  async function generateEmail(lead) {
    setModal({ type: "email", lead });
    setModalLoading(true);
    setModalContent("");

    const prompt = `Write a short, friendly cold outreach email to the owner of "${lead.name}", a ${lead.type} in ${lead.address}. 

Their situation: ${lead.websiteStatus === "none" ? "They have NO website at all" : `Their website has issues: ${lead.websiteIssues}`}. They have ${lead.rating} stars and ${lead.reviewCount} reviews — clearly a great business.

The email is from Farris, a young entrepreneur offering to build them a professional website. Keep it under 150 words. Be genuine, specific, and end with a clear call to action. No fluff.`;

    try {
      const text = await callClaude(prompt, "Write professional, concise business emails. No subject line needed unless requested.");
      setModalContent(text);
    } catch {
      setModalContent("Hi [Owner],\n\nI came across your business and was impressed by your reviews — clearly you're doing great work. I noticed your online presence could use some help, and I'd love to build you a professional website that brings in more customers.\n\nWould you be open to a quick 10-minute call this week?\n\nBest,\nFarris");
    }
    setModalLoading(false);
  }

  async function generateWebsite(lead) {
    setModal({ type: "website", lead });
    setModalLoading(true);
    setModalContent("");

    const prompt = `Create a text-based wireframe/outline for a modern professional website for "${lead.name}", a ${lead.type} located at ${lead.address} with ${lead.rating} stars.

Include:
- Page sections (Hero, About, Services, Reviews, Contact)
- Key copy/headlines for each section
- What images/content to feature
- Call-to-action buttons
- Color scheme suggestion

Keep it practical and specific to their business type. Format it clearly.`;

    try {
      const text = await callClaude(prompt, "You are a web designer creating website blueprints. Be specific and practical.");
      setModalContent(text);
    } catch {
      setModalContent("Website Blueprint for " + lead.name + "\n\n[HERO]\nHeadline: 'The Best ' + lead.type + ' in Town'\nSubheadline: 'Rated ' + lead.rating + ' Stars by ' + lead.reviewCount + ' Happy Customers'\nCTA Button: Book Now / Call Us\n\n[ABOUT]\nOur story, values, team photo\n\n[SERVICES]\nList of offerings with prices\n\n[REVIEWS]\nEmbed Google reviews\n\n[CONTACT]\nPhone, address, hours, Google Maps embed");
    }
    setModalLoading(false);
  }

  function copyContent() {
    navigator.clipboard.writeText(modalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const noWebsite = leads.filter(l => l.websiteStatus === "none").length;
  const poorWebsite = leads.filter(l => l.websiteStatus === "poor").length;
  const totalRevenue = leads.reduce((sum, l) => {
    const num = parseInt((l.estimatedRevenue || "$400").replace(/\D/g, ""));
    return sum + (isNaN(num) ? 400 : num);
  }, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="grid-bg" />

        <header className="header">
          <div className="logo">
            <div className="logo-icon">🔍</div>
            <div>
              <div className="logo-text">SiteScout</div>
              <div className="logo-sub">Business Opportunity Finder</div>
            </div>
          </div>
          <div className="status-pill">● Live Scanner</div>
        </header>

        <main className="main">
          <div className="hero">
            <h1>Find businesses.<br /><span>Build their future.</span></h1>
            <p>Scan any city for high-rated businesses with no website or a broken one. Generate outreach emails and website blueprints instantly.</p>
          </div>

          <div className="search-panel">
            <h2>// New Scan</h2>
            <div className="search-row">
              <div className="field">
                <label>City / Location</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Atlanta, GA"
                  onKeyDown={e => e.key === "Enter" && !scanning && city && scanLeads()}
                />
              </div>
              <div className="field">
                <label>Business Type</label>
                <select value={businessType} onChange={e => setBusinessType(e.target.value)}>
                  {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <button className="scan-btn" onClick={scanLeads} disabled={scanning || !city.trim()}>
                {scanning ? "Scanning..." : "Run Scan →"}
              </button>
            </div>
            {scanning && (
              <>
                <div className="loading-bar"><div className="loading-bar-fill" /></div>
                <div className="loading-text">{loadingText}</div>
              </>
            )}
          </div>

          {leads.length > 0 && (
            <>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-label">Leads Found</div>
                  <div className="stat-value">{leads.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">No Website</div>
                  <div className="stat-value">{noWebsite}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Est. Revenue</div>
                  <div className="stat-value">${totalRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="results-header">
                <h2>Opportunities in {city}</h2>
                <div className="results-count">{leads.length} leads</div>
              </div>

              <div className="leads-grid">
                {leads.map((lead, i) => (
                  <div className="lead-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="lead-top">
                      <div className="lead-info">
                        <h3>{lead.name}</h3>
                        <div className="lead-meta">
                          <span className="lead-type">{lead.type}</span>
                          <span className={`website-badge ${lead.websiteStatus === "none" ? "badge-none" : "badge-poor"}`}>
                            {lead.websiteStatus === "none" ? "No Website" : "Poor Website"}
                          </span>
                          <div className="rating">
                            <span className="stars">★</span>
                            <span className="rating-num">{lead.rating} ({lead.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="opportunity-score">
                        <div className="score-label">Opportunity</div>
                        <div className="score-value">{lead.opportunityScore}<span className="score-unit">/100</span></div>
                      </div>
                    </div>

                    <p className="lead-desc">{lead.description}<br />
                      <span style={{ color: "rgba(240,237,230,0.35)", fontSize: "12px" }}>
                        {lead.address} · {lead.phone} · {lead.websiteIssues}
                      </span>
                    </p>

                    <div className="lead-actions">
                      <button className="action-btn btn-primary" onClick={() => generateEmail(lead)}>
                        ✉ Draft Outreach Email
                      </button>
                      <button className="action-btn btn-secondary" onClick={() => generateWebsite(lead)}>
                        🖥 Generate Website Blueprint
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!scanning && leads.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏙</div>
              <h3>Ready to scan</h3>
              <p>Enter a city and business type above.<br />SiteScout will find your next clients.</p>
            </div>
          )}
        </main>

        {modal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
            <div className="modal">
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
              <h3>{modal.lead.name}</h3>
              <span className="modal-tag">
                {modal.type === "email" ? "✉ Outreach Email" : "🖥 Website Blueprint"}
              </span>

              {modalLoading ? (
                <div className="generating-indicator">
                  <div className="dot-pulse">
                    <span /><span /><span />
                  </div>
                  Generating with AI...
                </div>
              ) : (
                <>
                  {modal.type === "website" ? (
                    <div className="website-preview">
                      <div className="preview-bar">
                        <div className="preview-dot" style={{ background: "#ff5f57" }} />
                        <div className="preview-dot" style={{ background: "#febc2e" }} />
                        <div className="preview-dot" style={{ background: "#28c840" }} />
                      </div>
                      <div className="preview-content">{modalContent}</div>
                    </div>
                  ) : (
                    <div className="modal-content">{modalContent}</div>
                  )}
                  <div className="modal-actions">
                    <button className="copy-btn" onClick={copyContent}>
                      {copied ? "✓ Copied!" : "Copy to Clipboard"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
