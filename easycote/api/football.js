export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // POST = appel IA Anthropic
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const { path, source, ...params } = req.query;

  // Appel The Odds API
  if (source === 'odds') {
    try {
      const q = new URLSearchParams(params).toString();
      const url = `https://api.the-odds-api.com/v4${path}?apiKey=5ecfe5affbae9650142705647b9cc620${q ? '&' + q : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Appel Football-Data.org
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
