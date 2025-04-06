#!/usr/bin/env node

/**
 * CLI Tool for Dynamic Bio Website
 * 
 * Provides command-line interface for managing links and generating bios.
 */

const { program } = require('commander');
const { getLinks, addLink, removeLink, getBio, saveBio } = require('./lib/storage/linksStorage');
const { scrapeUrl } = require('./lib/scrapers/firecrawlScraper');
const { generateBio } = require('./lib/bioGenerator');

// Configure CLI
program
  .name('biocli')
  .description('CLI tool for managing links and generating bios')
  .version('1.0.0');

// Add link command
program
  .command('add-link')
  .description('Add a new link to the collection')
  .requiredOption('-u, --url <url>', 'URL to add')
  .option('-t, --title <title>', 'Title for the link (optional, will be extracted if not provided)')
  .option('-c, --commentary <commentary>', 'Your commentary about this link (e.g., "This was my role as CTO")')
  .option('-r, --regenerate', 'Regenerate the bio after adding the link', false)
  .action(async (options) => {
    try {
      console.log(`Scraping content from ${options.url}...`);
      const scraped = await scrapeUrl(options.url);
      
      // Use provided title or the scraped one
      if (options.title) {
        scraped.title = options.title;
      }
      
      // Add commentary if provided
      if (options.commentary) {
        scraped.commentary = options.commentary;
      }
      
      console.log(`Adding link: ${scraped.title}`);
      const added = await addLink(scraped);
      console.log(`Successfully added link: ${added.title}`);
      
      // Regenerate bio if requested
      if (options.regenerate) {
        console.log('Regenerating bio...');
        await regenerateBio();
      }
    } catch (error) {
      console.error(`Error adding link: ${error.message}`);
      process.exit(1);
    }
  });

// Remove link command
program
  .command('remove-link')
  .description('Remove a link from the collection')
  .requiredOption('-i, --id <id>', 'ID of the link to remove')
  .option('-r, --regenerate', 'Regenerate the bio after removing the link', false)
  .action(async (options) => {
    try {
      console.log(`Removing link with ID: ${options.id}`);
      const removed = await removeLink(options.id);
      
      if (removed) {
        console.log('Link successfully removed');
        
        // Regenerate bio if requested
        if (options.regenerate) {
          console.log('Regenerating bio...');
          await regenerateBio();
        }
      } else {
        console.log('Link not found');
      }
    } catch (error) {
      console.error(`Error removing link: ${error.message}`);
      process.exit(1);
    }
  });

// List links command
program
  .command('list-links')
  .description('List all stored links')
  .action(async () => {
    try {
      const links = await getLinks();
      
      if (links.length === 0) {
        console.log('No links found');
        return;
      }
      
      console.log(`Found ${links.length} links:`);
      links.forEach((link, index) => {
        console.log(`[${index + 1}] ${link.title} (${link.url})`);
        console.log(`    ID: ${link.id}`);
        console.log(`    Added: ${new Date(link.dateAdded).toLocaleString()}`);
        console.log('');
      });
    } catch (error) {
      console.error(`Error listing links: ${error.message}`);
      process.exit(1);
    }
  });

// Show bio command
program
  .command('show-bio')
  .description('Show the current bio')
  .action(async () => {
    try {
      const bio = await getBio();
      
      if (!bio.text) {
        console.log('No bio has been generated yet');
        return;
      }
      
      console.log('Current Bio:');
      console.log('------------');
      console.log(bio.text);
      console.log('');
      console.log(`Last updated: ${bio.lastUpdated ? new Date(bio.lastUpdated).toLocaleString() : 'Never'}`);
      console.log(`Version: ${bio.version}`);
    } catch (error) {
      console.error(`Error showing bio: ${error.message}`);
      process.exit(1);
    }
  });

// Generate bio command
program
  .command('generate-bio')
  .description('Generate a new bio based on the stored links')
  .option('-t, --tone <tone>', 'Tone of the bio (professional, casual, enthusiastic)', 'professional')
  .option('-l, --max-length <number>', 'Maximum length of the bio in characters', '500')
  .option('-n, --name <name>', 'Name to use in the bio')
  .action(async (options) => {
    try {
      await regenerateBio({
        tone: options.tone,
        maxLength: parseInt(options.maxLength, 10),
        name: options.name
      });
    } catch (error) {
      console.error(`Error generating bio: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Regenerate the bio using stored links
 * @param {Object} options Options for bio generation
 * @returns {Promise<void>}
 */
async function regenerateBio(options = {}) {
  const links = await getLinks();
  
  if (links.length === 0) {
    console.log('No links found, cannot generate bio');
    return;
  }
  
  console.log(`Generating bio based on ${links.length} links...`);
  const bioText = await generateBio(links, options);
  
  console.log('Saving bio...');
  const savedBio = await saveBio(bioText);
  
  console.log('Bio successfully generated and saved:');
  console.log('-----------------------------------');
  console.log(savedBio.text);
}

// Parse command line arguments
program.parse();

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 