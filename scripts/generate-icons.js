/**
 * Simple script to generate placeholder icons for development
 *
 * For production, replace these with proper designed icons.
 *
 * Usage: node scripts/generate-icons.js
 *
 * Note: This requires the 'canvas' package to be installed:
 * npm install canvas --save-dev
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let createCanvas;
try {
  createCanvas = require('canvas').createCanvas;
} catch (e) {
  console.log('Canvas package not installed. Creating SVG placeholders instead.');
  console.log('For PNG icons, install canvas: npm install canvas --save-dev');
  console.log('');
  console.log('Alternatively, create your icons manually:');
  console.log('- assets/icon.png (1024x1024)');
  console.log('- assets/adaptive-icon.png (1024x1024)');
  console.log('- assets/splash-icon.png (200x200)');
  console.log('- assets/favicon.png (48x48)');
  console.log('');
  console.log('Suggested design:');
  console.log('- Background: #6366F1 (Indigo)');
  console.log('- Icon: White checkmark or "HC" text');
  process.exit(0);
}

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function generateIcon(filename, size, backgroundColor = '#6366F1') {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Draw a simple checkmark icon
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const centerX = size / 2;
  const centerY = size / 2;
  const checkSize = size * 0.3;

  ctx.beginPath();
  ctx.moveTo(centerX - checkSize * 0.8, centerY);
  ctx.lineTo(centerX - checkSize * 0.2, centerY + checkSize * 0.5);
  ctx.lineTo(centerX + checkSize * 0.8, centerY - checkSize * 0.5);
  ctx.stroke();

  // Save the file
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(assetsDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filepath}`);
}

// Generate all required icons
console.log('Generating placeholder icons...');
generateIcon('icon.png', 1024);
generateIcon('adaptive-icon.png', 1024);
generateIcon('splash-icon.png', 200);
generateIcon('favicon.png', 48);

console.log('');
console.log('Placeholder icons generated successfully!');
console.log('Replace these with properly designed icons before publishing.');
