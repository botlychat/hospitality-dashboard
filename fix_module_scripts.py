#!/usr/bin/env python3
"""Fix all HTML files - move inline code to proper script tags"""

import os
import re

os.chdir(r'c:\Users\ahmad_xk7dsla\Documents\GitHub\hospitality-dashboard')

html_files = ['dashboard.html', 'units.html', 'aiagent.html', 'contacts.html', 'website.html', 'index.html']

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Change <script type="module"> with imports to regular <script>
    content = re.sub(
        r'<script type="module">\s*// Import Supabase client\s*import \{ supabase, getCurrentUser, getUserOrganization, getUserUnits \} from \'\.\/lib\/supabase-client\.js\'',
        '''<!-- Inline JavaScript -->
	<script>
		// Note: External JS files are loaded after this one
		// Error tracking''',
        content
    )
    
    # Fix 2: Update base href path references from /chaletdashboard/ to /hospitality-dashboard/
    content = content.replace('/chaletdashboard/', '/hospitality-dashboard/')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✓ Fixed: {fname}')

print('\n✓ All HTML files fixed!')
