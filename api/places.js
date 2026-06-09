export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city, type } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!city || !type) {
    return res.status(400).json({ error: 'Missing city or type parameter' });
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(type + ' in ' + city)}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ error: searchData.status, details: searchData.error_message });
    }

    const places = searchData.results || [];

    const candidates = places.filter(p =>
      p.rating >= 4.0 &&
      p.user_ratings_total >= 50
    );

    const detailPromises = candidates.slice(0, 20).map(async (place) => {
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,formatted_address,formatted_phone_number,website,types,url&key=${apiKey}`;
      const detailRes = await fetch(detailUrl);
      const detailData = await detailRes.json();
      return detailData.result;
    });

    const details = await Promise.all(detailPromises);

    const leads = details
      .filter(d => d && !d.website)
      .map(d => ({
        name: d.name,
        rating: d.rating,
        reviews: d.user_ratings_total,
        address: d.formatted_address,
        phone: d.formatted_phone_number || 'N/A',
        type: d.types ? d.types[0].replace(/_/g, ' ') : type,
        googleMapsUrl: d.url,
        hasWebsite: false,
      }));

    return res.status(200).json({ leads, total: leads.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
