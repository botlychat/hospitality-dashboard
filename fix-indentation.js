import fs from 'fs';

// Files to convert from 2-space to tab indentation
const filesToConvert = [
  'calendar.html',
  'units.html',
  'contacts.html',
  'aiagent.html',
  'website.html',
  'business-info.html'
];

filesToConvert.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Convert 2-space indentation to tabs
    // This converts leading spaces to tabs (2 spaces = 1 tab)
    content = content.split('\n').map(line => {
      // Count leading spaces
      const match = line.match(/^( +)/);
      if (match) {
        const spaces = match[1].length;
        const tabs = Math.floor(spaces / 2);
        const remainder = spaces % 2;
        const newIndent = '\t'.repeat(tabs) + ' '.repeat(remainder);
        return newIndent + line.substring(spaces);
      }
      return line;
    }).join('\n');
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ Converted ${file} to tab indentation`);
  } catch (err) {
    console.error(`✗ Error with ${file}:`, err.message);
  }
});

console.log('\n✅ Indentation conversion complete!');
