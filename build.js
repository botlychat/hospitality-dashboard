import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of HTML files to process
const htmlFiles = [
  'index.html',
  'dashboard.html',
  'units.html',
  'calendar.html',
  'contacts.html',
  'aiagent.html',
  'website.html',
  'account-settings.html'
];

// Read the layout template
const layoutTemplate = fs.readFileSync(
  path.join(__dirname, 'src/components/layout.html'),
  'utf-8'
);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static assets
const assetsToClone = ['css', 'js', 'service-worker.js', '.nojekyll'];
assetsToClone.forEach(asset => {
  const srcPath = path.join(__dirname, asset);
  const destPath = path.join(distDir, asset);
  
  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
});

// Helper function to recursively copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Process each HTML file
htmlFiles.forEach(htmlFile => {
  const srcPath = path.join(__dirname, htmlFile);
  
  if (!fs.existsSync(srcPath)) {
    console.warn(`Skipping ${htmlFile} - file not found`);
    return;
  }
  
  // Read the original HTML
  let html = fs.readFileSync(srcPath, 'utf-8');
  
  // Extract page-specific content (everything after </head> and inside <body>)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  
  if (!bodyMatch || !headMatch) {
    console.warn(`Skipping ${htmlFile} - invalid structure`);
    return;
  }
  
  const pageHead = headMatch[1];
  const pageBody = bodyMatch[1];
  
  // Extract the page content (inside .app > main > .content)
  const contentMatch = pageBody.match(/<section\s+class="content"[^>]*>([\s\S]*?)<\/section>/);
  const pageContent = contentMatch ? contentMatch[1] : '';
  
  // Extract page-specific scripts (everything after </section> closing tag)
  const scriptsAfterContentMatch = pageBody.match(/<\/section>([\s\S]*?)(?=<\/div>\s*<\/body>|$)/);
  const pageScripts = scriptsAfterContentMatch ? scriptsAfterContentMatch[1].trim() : '';
  
  // Build the new HTML with layout template and page-specific content + scripts
  const newHtml = `<!doctype html>
<html lang="en">
<head>
${pageHead}
</head>
<body>
	<div class="app">
${layoutTemplate.replace('<!-- PAGE_CONTENT_PLACEHOLDER -->', pageContent)}
	</div>
${pageScripts}
</body>
</html>`;
  
  // Write to dist
  const destPath = path.join(distDir, htmlFile);
  fs.writeFileSync(destPath, newHtml, 'utf-8');
  console.log(`✓ Built ${htmlFile}`);
});

console.log('\n✅ Build complete! Output in ./dist');
