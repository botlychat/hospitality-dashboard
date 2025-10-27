import re
import os

os.chdir(r'c:\Users\ahmad_xk7dsla\Documents\GitHub\hospitality-dashboard')

html_files = ['units.html', 'aiagent.html', 'contacts.html', 'website.html', 'index.html']

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find last console.log line before </body> and replace with script tags
    pattern = r"console\.log\('\[.*?\].*?'\);\s*</body>"
    replacement = """<!-- Extracted JavaScript Files -->
	<script src="js/utils.js"></script>
	<script src="js/components.js"></script>
	<script src="js/components/profile.js"></script>
	<script src="lib/supabase-client.js"></script>
</body>"""
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Fixed: {html_file}')
