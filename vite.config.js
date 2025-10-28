import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

// Custom plugin to inject layout into HTML files
const layoutInjectionPlugin = {
  name: 'layout-injection',
  
  async resolveId(id) {
    // Handle layout template resolution
    if (id === 'virtual:layout-template') {
      return id;
    }
  },
  
  async load(id) {
    if (id === 'virtual:layout-template') {
      const layoutPath = path.resolve(__dirname, 'src/components/layout.html');
      return fs.readFileSync(layoutPath, 'utf-8');
    }
  },
  
  async transform(code, id) {
    // Only process HTML files
    if (!id.endsWith('.html') || id.includes('node_modules')) {
      return null;
    }
    
    // Skip layout.html itself
    if (id.includes('src/components/layout.html')) {
      return null;
    }
    
    // Read layout template
    const layoutPath = path.resolve(__dirname, 'src/components/layout.html');
    if (!fs.existsSync(layoutPath)) {
      return null;
    }
    
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    
    // Replace placeholder with actual layout
    let modifiedCode = code;
    
    // Find the main content area and inject layout before it
    if (code.includes('<!-- LAYOUT_PLACEHOLDER -->')) {
      modifiedCode = code.replace(
        '<!-- LAYOUT_PLACEHOLDER -->',
        layoutContent
      );
    }
    
    return { code: modifiedCode };
  }
};

export default defineConfig({
  base: '/hospitality-dashboard/',
  plugins: [layoutInjectionPlugin],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
        units: path.resolve(__dirname, 'units.html'),
        calendar: path.resolve(__dirname, 'calendar.html'),
        contacts: path.resolve(__dirname, 'contacts.html'),
        aiagent: path.resolve(__dirname, 'aiagent.html'),
        website: path.resolve(__dirname, 'website.html'),
        businessInfo: path.resolve(__dirname, 'business-info.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    open: '/hospitality-dashboard/dashboard.html',
    port: 5173
  }
});
