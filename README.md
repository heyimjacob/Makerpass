# Makerport

A dynamic bio generator that evolves with your content. This application automatically generates and updates your professional bio based on your online content.

## Features

- **Automated Bio Generation**: Creates professional bios using AI
- **Content Integration**: Pulls from multiple online sources
- **Dynamic Updates**: Bio evolves as you add new content
- **Simple CLI**: Easy-to-use command-line interface
- **Web Interface**: Clean, professional presentation
- **Automated Deployment**: GitHub Actions for seamless updates

## Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/heyimjacob/makerport.git
   cd makerport
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the application:
   ```bash
   npm start
   ```

### Production Deployment

See [Deployment Guide](docs/deployment.md) for detailed instructions.

## Usage

### Adding Content

```bash
# Add a new link
node cli.js add https://example.com

# View your current bio
node cli.js view
```

### Web Interface

Access the web interface at `http://localhost:3000` (or your server's IP/domain).

## Project Structure

```
makerport/
├── docs/               # Documentation
├── lib/                # Core functionality
│   ├── bioGenerator.js
│   ├── scrapers/
│   └── storage/
├── public/            # Static assets
├── views/             # EJS templates
├── cli.js            # Command-line interface
├── index.js          # Web server
├── package.json      # Dependencies
└── docker-compose.yml # Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository. 