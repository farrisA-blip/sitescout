import { useState } from 'react'
import './App.css'

const BUSINESS_TYPES = [
  'restaurant',
  'hair salon',
  'barbershop',
  'nail salon',
  'auto repair',
  'dentist',
  'plumber',
  'electrician',
  'landscaping',
  'cleaning service',
  'massage therapy',
  'gym',
  'bakery',
  'coffee shop',
  'pet grooming',
]

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < full ? 'star full' : i === full && half ? 'star half' : 'star empty'}>★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </span>
  )
}

function LeadCard({ lead, index }) {
  return (
    <div className="lead-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="lead-header">
        <div>
          <h3 className="lead-name">{lead.name}</h3>
          <span className="lead-type">{lead.type}</span>
        </div>
        <div className="no-website-badge">No Website</div>
      </div>
      <div className="lead-meta">
        <StarRating rating={lead.rating} />
        <span className="review-count">{lead.reviews.toLocaleString()} reviews</span>
      </div>
      <div className="lead-details">
        <div className="lead-detail">📍 {lead.address}</div>
        {lead.phone !== 'N/A' && <div className="lead-detail">📞 {lead.phone}</div>}
      </div>
      {lead.googleMapsUrl && (
        <a href={lead.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
          View on Google Maps →
        </a>
      )}
    </div>
  )
}

export default function App() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('restaurant')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!city.trim()) {
      setError('Please enter a city name.')
      return
    }
    setLoading(true)
    setError('')
    setLeads([])
    setSearched(false)

    try {
      const res = await fetch(`/api/places?city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Check your API key.')
      } else {
        setLeads(data.leads || [])
        setSearched(true)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🔍</span>
            <span className="logo-text">SiteScout</span>
          </div>
          <p className="tagline">Find high-rated local businesses with no website — real leads, real opportunity.</p>
        </div>
      </header>

      <main className="main">
        <section className="search-section">
          <div className="search-card">
            <h2 className="search-title">Find Leads</h2>
            <p className="search-subtitle">Businesses with 4.0+ stars, 50+ reviews, and <strong>no website</strong>.</p>
            <div className="search-row">
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Houston, TX"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="type">Business Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="input"
                >
                  {BUSINESS_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="search-btn"
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
            {error && <div className="error-msg">{error}</div>}
          </div>
        </section>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Scanning Google Maps for businesses without websites…</p>
          </div>
        )}

        {searched && !loading && (
          <section className="results-section">
            <div className="results-header">
              <h2>
                {leads.length > 0
                  ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} found in ${city}`
                  : `No leads found in ${city}`}
              </h2>
              {leads.length === 0 && (
                <p className="no-results">Try a different city or business type — not every area has unwebbed businesses in this category.</p>
              )}
            </div>
            <div className="leads-grid">
              {leads.map((lead, i) => (
                <LeadCard key={i} lead={lead} index={i} />
              ))}
            </div>
          </section>
        )}

        {!searched && !loading && (
          <section className="empty-state">
            <div className="empty-icon">📍</div>
            <h3>Ready to scout</h3>
            <p>Enter a city and business type to find real businesses on Google Maps that are missing a website — your next client could be one search away.</p>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>SiteScout — Real leads from Google Maps. Built for freelance web designers.</p>
      </footer>
    </div>
  )
}
