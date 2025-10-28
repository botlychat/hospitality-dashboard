# Hospitality Dashboard

A modern, responsive admin dashboard for hospitality booking management built with vanilla HTML, CSS, and JavaScript.

**Live Demo:** https://botlychat.github.io/hospitality-dashboard/

## Features

- 📊 **Dashboard** - KPIs, revenue tracking, occupancy rates
- 🏨 **Unit Management** - Manage properties, groups, and pricing
- 📅 **Calendar** - Interactive booking calendar with event management
- 👥 **Contacts** - Client management and communication
- 🤖 **AI Agent** - Configure AI-powered booking assistant
- ⚙️ **Settings** - Website customization and business info
- 🌍 **Multi-language** - English/Arabic with RTL support
- 📱 **Responsive** - Mobile-first design, works on all devices
- 🌙 **Theme Customization** - Dynamic color scheme switching

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage:** localStorage with safe wrapper (js/storage.js)
- **Deployment:** GitHub Pages with automated CI/CD
- **Icons:** Font Awesome 6.5.1
- **Architecture:** Multi-page application (no framework)

## Project Structure

```
hospitality-dashboard/
├── index.html              # Main landing page
├── dashboard.html          # Dashboard with KPIs
├── units.html              # Unit management
├── calendar.html           # Booking calendar
├── contacts.html           # Client contacts
├── aiagent.html            # AI agent configuration
├── website.html            # Website settings
├── business-info.html      # Business information
├── css/                    # Stylesheets (external)
│   ├── variables.css       # CSS custom properties
│   ├── global.css          # Global styles & utilities
│   ├── responsive.css      # Responsive breakpoints
│   ├── profile.css         # User profile styling
│   ├── dashboard.css       # Dashboard-specific
│   ├── units.css           # Units page-specific
│   ├── calendar.css        # Calendar page-specific
│   ├── contacts.css        # Contacts page-specific
│   ├── aiagent.css         # AI Agent page-specific
│   └── website.css         # Website settings page-specific
├── js/                     # JavaScript modules
│   ├── storage.js          # Safe localStorage wrapper (350+ lines)
│   ├── utils.js            # Utility functions
│   ├── components.js       # Reusable components
│   ├── modals.js           # Modal functionality
│   └── components/
│       └── profile.js      # Profile component
└── README.md               # This file
```

## Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/botlychat/hospitality-dashboard.git
   cd hospitality-dashboard
   ```

2. **Open in browser:**
   - Open `index.html` directly in your browser, or
   - Use a local server: `python -m http.server 8000`

3. **Access the app:**
   - Local: `http://localhost:8000`
   - Online: https://botlychat.github.io/hospitality-dashboard/

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Storage System

This project uses a safe localStorage wrapper (`js/storage.js`) with comprehensive error handling:

### Safe Methods Available

```javascript
// String operations
Storage.getString(key, fallback)
Storage.setString(key, value)

// JSON operations (auto-parsing)
Storage.getJSON(key, fallback)
Storage.setJSON(key, value)

// Number operations
Storage.getNumber(key, fallback)
Storage.setNumber(key, value)

// Advanced
Storage.getWithTTL(key, fallback)        // Auto-expiring values
Storage.setWithTTL(key, value, ttlMs)
Storage.hasKey(key)
Storage.remove(key)
Storage.removeMultiple(keys)
Storage.clear()
Storage.getAllKeys()
Storage.getSizeInfo()
```

### Error Handling

All storage operations handle:
- ✅ Corrupted JSON data
- ✅ Storage quota exceeded
- ✅ Private browsing mode
- ✅ Invalid data types
- ✅ Cross-origin issues

**See:** `STORAGE_HELPER_IMPLEMENTATION.md` for detailed API documentation.

## Responsive Design

### Breakpoints

- **Desktop:** 1100px and up
- **Tablet:** 980px to 1099px
- **Mobile:** 640px to 979px
- **Small Mobile:** Below 640px

### Mobile Features

- ✅ Touch-friendly interface
- ✅ Hamburger menu on mobile
- ✅ Optimized table views
- ✅ Responsive charts and KPIs

## Internationalization

### Supported Languages

- **English** - Default
- **العربية (Arabic)** - Full RTL support

### Language Switching

Click the language toggle button in the dashboard header to switch between English and Arabic. Selection is automatically saved.

## Customization

### Color Scheme

Change the primary accent color:
1. Dashboard → Settings → Website Theme Color
2. Or edit `css/variables.css` → `--accent` color

### Business Information

1. Dashboard → Settings → Business Information
2. Enter your company name, license, contact details
3. Information is automatically saved and restored

## Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. GitHub Actions automatically deploys to: https://botlychat.github.io/hospitality-dashboard/
3. No manual deployment needed

### Configuration Files

- `.github/workflows/deploy.yml` - CI/CD configuration
- `.nojekyll` - Disables Jekyll processing
- `.htaccess` - Clean URL rewrites (optional)

## Performance

- ⚡ No external frameworks (vanilla JS)
- 📦 ~150KB total (HTML + CSS + JS)
- 🚀 Fast initial load
- 💾 Minimal localStorage usage
- 🎯 Optimized for mobile

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE 11   | ⚠️ Limited |

## Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Forms save and restore data correctly
- [ ] Private browsing mode works
- [ ] Mobile view is responsive
- [ ] Language switching works
- [ ] Color theme changes apply globally
- [ ] No console errors

### Testing in Private Browsing

The app continues to work in private browsing mode thanks to the Storage helper's fallback mechanisms.

## Known Limitations

- No server-side persistence (localStorage only)
- No user authentication
- No real booking integration
- Simulated data for demonstration

## Future Enhancements

- [ ] Backend API integration
- [ ] Real booking system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS capabilities
- [ ] Advanced reporting
- [ ] Multi-user support

## Documentation

- **REFACTORING_COMPLETE.md** - Storage helper migration summary
- **STORAGE_HELPER_IMPLEMENTATION.md** - Complete API documentation

## Contributing

This is a demo project. For improvements or issues, please:

1. Create an issue on GitHub
2. Fork the repository
3. Submit a pull request

## License

MIT License - Feel free to use for personal or commercial projects.

## Support

For questions or issues:
- 📧 Check the GitHub repository
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions

---

**Last Updated:** October 28, 2025
**Version:** 2.0 (Storage Helper Refactored)
**Status:** Production Ready ✅
