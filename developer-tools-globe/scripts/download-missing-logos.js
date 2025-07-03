const https = require('https');
const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, '..', 'public', 'logos');

// Alternative sources for missing logos
const missingLogos = {
  // Java from official Oracle
  'java': 'https://www.vectorlogo.zone/logos/java/java-icon.svg',
  
  // Claude/Anthropic from Anthropic's brand assets
  'claude': 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
  
  // REST API - using Swagger/OpenAPI logo
  'rest': 'https://www.vectorlogo.zone/logos/openapis/openapis-icon.svg'
};

// Function to download from URL
function downloadFromUrl(localId, url) {
  const filePath = path.join(logosDir, `${localId}.svg`);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    // Handle redirects
    if (response.statusCode === 301 || response.statusCode === 302) {
      console.log(`Following redirect for ${localId}...`);
      downloadFromUrl(localId, response.headers.location);
      return;
    }
    
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${localId} from ${url}`);
      });
    } else {
      console.log(`✗ Failed to download ${localId}: ${response.statusCode}`);
      file.close();
      fs.unlinkSync(filePath);
    }
  }).on('error', (err) => {
    console.log(`✗ Error downloading ${localId}: ${err.message}`);
    fs.unlinkSync(filePath);
  });
}

// Try alternative CDNs and sources
const alternativeSources = [
  {
    name: 'Java',
    id: 'java',
    urls: [
      'https://cdn.worldvectorlogo.com/logos/java-4.svg',
      'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
    ]
  },
  {
    name: 'Claude/Anthropic',
    id: 'claude',
    urls: [
      'https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/logo.svg',
      'https://www.anthropic.com/favicon.svg'
    ]
  },
  {
    name: 'REST API',
    id: 'rest',
    urls: [
      'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_rest.svg',
      'https://cdn.worldvectorlogo.com/logos/openapi-1.svg'
    ]
  }
];

console.log('Downloading missing logos from alternative sources...\n');

// Try each alternative source
alternativeSources.forEach(({ name, id, urls }) => {
  console.log(`Trying to download ${name}...`);
  
  // Try first URL
  const url = urls[0];
  const filePath = path.join(logosDir, `${id}.svg`);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${id}.svg from ${url}`);
      });
    } else {
      console.log(`✗ Failed with first URL, trying alternatives...`);
      file.close();
      fs.unlinkSync(filePath);
      
      // Try alternative URLs if first fails
      if (urls.length > 1) {
        downloadFromUrl(id, urls[1]);
      }
    }
  }).on('error', (err) => {
    console.log(`✗ Error: ${err.message}`);
  });
});