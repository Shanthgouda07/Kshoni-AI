const fs = require('fs');
const path = require('path');
const https = require('https');

const imgDir = path.join(__dirname, '../assets/images');

const photos = [
  {
    name: 'online_mine_2.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' // Industrial processing & gasification complex
  },
  {
    name: 'online_mine_6.jpg',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' // Rail transport & logistics infrastructure
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status code: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of photos) {
    const targetPath = path.join(imgDir, item.name);
    try {
      await downloadFile(item.url, targetPath);
      console.log(`✓ Downloaded: ${item.name}`);
    } catch (err) {
      console.log(`⚠️ Error for ${item.name}: ${err.message}`);
    }
  }
}

run();
