#!/usr/bin/env python3
"""Fix all HTML files: remove old code, add new links"""

import os
import re

# Map HTML files to their specific CSS file
html_files_map = {
    'dashboard.html': 'dashboard',
    'units.html': 'units',
    'aiagent.html': 'aiagent',
    'contacts.html': 'contacts',
    'website.html': 'website',
    'index.html': 'index'
}

# Common CSS files for all pages
common_css_files = [
    'css/variables.css',
    'css/global.css',
    'css/responsive.css',
    'css/profile.css'
]

# JS files for all pages (before </body>)
js_files = [
    'js/utils.js',
    'js/components.js',
    'js/components/profile.js',
    'lib/supabase-client.js'
]

def fix_html_file(filepath, page_css_file):
    """Fix a single HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Step 1: Remove old inline script block (before closing body)
    # Find and remove <script>...</script> blocks that are NOT src-based
    content = re.sub(r'\n\s*<script>[\s\S]*?</script>\s*\n', '\n', content)
    
    # Step 2: Remove duplicate </head><body> tags created by earlier fix
    content = content.replace('</head>\n<body>\n</head>\n<body>', '</head>\n<body>')
    
    # Step 3: Fix base href to use /hospitality-dashboard/ for GitHub Pages
    content = re.sub(
        r'<base href="[^"]*">',
        '<base href="/hospitality-dashboard/">',
        content
    )
    
    # Step 4: Remove any existing CSS comment + links that were already added
    content = re.sub(
        r'\t<!-- Extracted & Organized CSS Files -->\n(\t<link rel="stylesheet" href="css/[^"]*">\n)*',
        '',
        content
    )
    
    # Step 5: Add CSS links in the head (after Font Awesome)
    # Find the Font Awesome link and insert after it
    fa_link = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'
    
    css_links = '\t<!-- Extracted & Organized CSS Files -->\n'
    for css_file in common_css_files:
        css_links += f'\t<link rel="stylesheet" href="{css_file}">\n'
    # Add page-specific CSS
    css_links += f'\t<link rel="stylesheet" href="css/{page_css_file}.css">'
    
    if fa_link in content:
        content = content.replace(
            fa_link,
            fa_link + '\n' + css_links
        )
    
    # Step 6: Remove any existing JS comment + script tags that were already added
    content = re.sub(
        r'\t<!-- Extracted JavaScript Files -->\n(\t<script src="[^"]*"></script>\n)*',
        '',
        content
    )
    
    # Step 7: Add JS script tags before </body>
    js_tags = '\t<!-- Extracted JavaScript Files -->\n'
    for js_file in js_files:
        js_tags += f'\t<script src="{js_file}"></script>\n'
    
    # Replace </body> with scripts + </body>
    content = content.replace('</body>', js_tags + '</body>')
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✓ Fixed: {os.path.basename(filepath)}')

def main():
    os.chdir(r'c:\Users\ahmad_xk7dsla\Documents\GitHub\hospitality-dashboard')
    
    for html_file, css_name in html_files_map.items():
        if os.path.exists(html_file):
            fix_html_file(html_file, css_name)
        else:
            print(f'⚠ Not found: {html_file}')
    
    print('\n✓ All HTML files fixed!')

if __name__ == '__main__':
    main()
