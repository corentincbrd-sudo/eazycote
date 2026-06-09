export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const query = new URLSearchParams(params).toString();
  const url = `https://api.football-data.org/v4${path}${query ? '?' + query : ''}`;

  try {
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': '75e23d8a6a9941efb0f96b399b47b7fb' }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
