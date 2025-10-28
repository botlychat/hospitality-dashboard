#!/bin/bash
# Build script to create clean URL structure

echo "🚀 Creating clean URL structure..."

# Create clean URL copies (without .html extension)
cp dashboard.html dashboard
cp calendar.html calendar  
cp units.html units
cp contacts.html contacts
cp website.html website
cp aiagent.html aiagent
cp business-info.html business-info

echo "✅ Clean URLs created!"
echo ""
echo "📁 File structure:"
echo "   /dashboard     (clean URL)"
echo "   /calendar      (clean URL)"
echo "   /units         (clean URL)"
echo "   /contacts      (clean URL)"
echo "   /website       (clean URL)"
echo "   /aiagent       (clean URL)"
echo ""
echo "🌐 URLs will work as:"
echo "   website.com/dashboard"
echo "   website.com/calendar"
echo "   website.com/units"
echo "   etc..."