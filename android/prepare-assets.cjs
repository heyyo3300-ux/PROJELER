'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sourceArgument = process.argv.indexOf('--source');
const source = path.resolve(sourceArgument >= 0 ? process.argv[sourceArgument + 1] : path.join(__dirname, '..'));
const output = path.join(__dirname, 'app', 'src', 'main', 'assets', 'www');
const files = ['index.html', 'engine.js', 'renderer.js', 'progress.js', 'app.js', 'style.css', 'expansion.css', 'mobile.css', 'images.png', 'favicon.svg', 'manifest.webmanifest'];
for (const file of files) if (!fs.statSync(path.join(source, file), { throwIfNoEntry: false })?.isFile()) throw new Error('Eksik oyun dosyası: ' + file);
const iconSource = path.join(source, 'icons');
if (!fs.statSync(iconSource, { throwIfNoEntry: false })?.isDirectory()) throw new Error('icons/ klasörü eksik');
fs.mkdirSync(output, { recursive: true });
for (const file of files) fs.copyFileSync(path.join(source, file), path.join(output, file));
fs.cpSync(iconSource, path.join(output, 'icons'), { recursive: true });
// Native APK assets are already offline. Disable service-worker interception so
// an older WebView worker can never shadow a newly installed APK's bundled files.
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
fs.writeFileSync(path.join(output, 'index.html'), html.replace(/<head>/i, '<head>\n<script>window.DOA_NATIVE=true;<\/script>'));
console.log('Android oyun varlıkları hazır: ' + files.length + ' dosya + simgeler.');
