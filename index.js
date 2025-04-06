/**
 * Dynamic Bio Website
 * 
 * Main server file for the web application.
 */

const express = require('express');
const path = require('path');
const { getLinks, getBio } = require('./lib/storage/linksStorage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Main route
app.get('/', async (req, res) => {
  try {
    // Get bio and links
    const bio = await getBio();
    const links = await getLinks();
    
    // Render homepage
    res.render('index', {
      title: 'Jacob Edgar-Anderson',
      bio: bio.text || 'Bio not available yet.',
      links: links,
      lastUpdated: bio.lastUpdated ? new Date(bio.lastUpdated).toLocaleString() : 'Never'
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).send('Error loading page');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 