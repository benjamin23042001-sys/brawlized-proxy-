const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // autorise tous les navigateurs

const BS_TOKEN = 'TON_TOKEN_ICI'; // ta clé API Brawl Stars
const BS_BASE = 'https://api.brawlstars.com/v1';

// Proxy générique — toutes les routes /api/* sont relayées
app.get('/api/*', async (req, res) => {
  const path = req.path.replace('/api', '');
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const url = BS_BASE + path + query;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BS_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Brawlify (brawlers + events, pas besoin de clé)
app.get('/brawlify/*', async (req, res) => {
  const path = req.path.replace('/brawlify', '');
  const url = 'https://api.brawlify.com/v1' + path;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));