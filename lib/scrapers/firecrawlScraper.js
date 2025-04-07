/**
 * Mock Scraper Module for Development
 * 
 * Simulates content scraping for development and testing.
 */

require('dotenv').config();

/**
 * Mock scrape content from a URL
 * @param {string} url URL to scrape
 * @returns {Promise<Object>} Scraped content and metadata
 */
async function scrapeUrl(url) {
  if (!url) {
    throw new Error('URL is required');
  }

  // For development, return mock data
  return {
    url,
    title: url.replace(/^https?:\/\//, '').split('/')[0],
    contentSummary: `This is a mock content summary for ${url}. In production, this would be actual scraped content from the webpage.`,
    metadata: {
      scrapeDate: new Date().toISOString(),
      contentType: 'webpage',
      wordCount: 100,
      links: [],
      images: []
    }
  };
}

/**
 * Mock batch scrape multiple URLs
 * @param {string[]} urls Array of URLs to scrape
 * @returns {Promise<Object[]>} Array of scraped content objects
 */
async function batchScrapeUrls(urls) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    throw new Error('URLs array is required and must not be empty');
  }

  return Promise.all(urls.map(url => scrapeUrl(url)));
}

module.exports = {
  scrapeUrl,
  batchScrapeUrls
}; 