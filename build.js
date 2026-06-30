const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const buildDir = path.join(rootDir, 'build');

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(path.join(buildDir, 'public'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'db'), { recursive: true });

for (const item of ['server.js', 'package.json', 'ecosystem.config.js']) {
  const src = path.join(rootDir, item);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(buildDir, item));
  }
}

fs.cpSync(path.join(rootDir, 'public'), path.join(buildDir, 'public'), { recursive: true });
fs.cpSync(path.join(rootDir, 'db'), path.join(buildDir, 'db'), { recursive: true });

console.log('Build completed successfully');
