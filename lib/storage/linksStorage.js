/**
 * Links Storage Module
 * 
 * Handles storage and retrieval of links and scraped content using JSON files.
 */

const fs = require('fs').promises;
const path = require('path');

// File paths for storage
const DATA_DIR = '/app/data';
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const BIO_FILE = path.join(DATA_DIR, 'bio.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Get all stored links
 * @returns {Promise<Array>} Array of link objects
 */
async function getLinks() {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(LINKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return [];
    }
    throw error;
  }
}

/**
 * Add a new link to storage
 * @param {Object} link Link object to add
 * @param {string} link.url URL of the link
 * @param {string} link.title Title of the link
 * @param {string} link.contentSummary Summary of scraped content
 * @param {string} [link.commentary] User's commentary about the link
 * @returns {Promise<Object>} The added link with metadata
 */
async function addLink(link) {
  if (!link.url) {
    throw new Error('URL is required');
  }

  const links = await getLinks();
  
  // Check if link already exists
  const existingLink = links.find(l => l.url === link.url);
  if (existingLink) {
    throw new Error('Link already exists');
  }
  
  // Add metadata
  const newLink = {
    ...link,
    id: Date.now().toString(),
    dateAdded: new Date().toISOString(),
    scrapeDate: link.scrapeDate || new Date().toISOString(),
    commentary: link.commentary || null
  };
  
  // Add to links array and save
  links.push(newLink);
  await fs.writeFile(LINKS_FILE, JSON.stringify(links, null, 2));
  
  return newLink;
}

/**
 * Remove a link from storage
 * @param {string} id ID of the link to remove
 * @returns {Promise<boolean>} True if link was removed, false if not found
 */
async function removeLink(id) {
  const links = await getLinks();
  const initialLength = links.length;
  
  const filteredLinks = links.filter(link => link.id !== id);
  
  if (filteredLinks.length === initialLength) {
    return false; // No link was removed
  }
  
  await fs.writeFile(LINKS_FILE, JSON.stringify(filteredLinks, null, 2));
  return true;
}

/**
 * Get the current bio
 * @returns {Promise<Object>} Bio object with text and metadata
 */
async function getBio() {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(BIO_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty bio
      return {
        text: '',
        lastUpdated: null,
        version: 0
      };
    }
    throw error;
  }
}

/**
 * Save a new bio
 * @param {string} bioText The generated bio text
 * @returns {Promise<Object>} The saved bio object with metadata
 */
async function saveBio(bioText) {
  const currentBio = await getBio();
  
  const newBio = {
    text: bioText,
    lastUpdated: new Date().toISOString(),
    version: (currentBio.version || 0) + 1,
    previousVersion: currentBio.text ? currentBio.text : null
  };
  
  await fs.writeFile(BIO_FILE, JSON.stringify(newBio, null, 2));
  
  return newBio;
}

module.exports = {
  getLinks,
  addLink,
  removeLink,
  getBio,
  saveBio
}; 