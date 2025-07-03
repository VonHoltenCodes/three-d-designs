const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple Icons CDN for high-quality tech logos
const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons';

// Map our logo IDs to Simple Icons names
const logoMappings = {
  'javascript': 'javascript',
  'typescript': 'typescript', 
  'python': 'python',
  'rust': 'rust',
  'go': 'go',
  'java': 'java',
  'cpp': 'cplusplus',
  'ruby': 'ruby',
  'php': 'php',
  'swift': 'swift',
  'react': 'react',
  'nextjs': 'nextdotjs',
  'vue': 'vuedotjs',
  'angular': 'angular',
  'svelte': 'svelte',
  'nodejs': 'nodedotjs',
  'aws': 'amazonaws',
  'gcp': 'googlecloud',
  'azure': 'microsoftazure',
  'vercel': 'vercel',
  'netlify': 'netlify',
  'cloudflare': 'cloudflare',
  'claude': 'anthropic',
  'github': 'github',
  'git': 'git',
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'vscode': 'visualstudiocode',
  'webstorm': 'webstorm',
  'vim': 'vim',
  'postgresql': 'postgresql',
  'mongodb': 'mongodb',
  'redis': 'redis',
  'graphql': 'graphql',
  'rest': 'openapi'
};

// Ensure logos directory exists
const logosDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Function to download a logo
function downloadLogo(localId, simpleIconsId) {
  const url = `${SIMPLE_ICONS_CDN}/${simpleIconsId}.svg`;
  const filePath = path.join(logosDir, `${localId}.svg`);
  
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${localId}.svg`);
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

// Download all logos
console.log('Downloading logos from Simple Icons...\n');
Object.entries(logoMappings).forEach(([localId, simpleIconsId]) => {
  downloadLogo(localId, simpleIconsId);
});

console.log('\nNote: Some logos might not be available. Fallbacks will be used for those.');