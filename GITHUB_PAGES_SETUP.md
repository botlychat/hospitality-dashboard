# GitHub Pages Deployment Guide

## ✅ Setup Complete

Your hospitality-dashboard is now configured for automatic GitHub Pages deployment.

---

## 🚀 How it works

### Automatic Deployment
- **Trigger**: Every push to `main` branch automatically deploys
- **Workflow**: `.github/workflows/deploy.yml` handles the deployment
- **Build**: No build step needed — static HTML files deploy directly
- **Pages**: GitHub Pages serves your content at the repository URL

### Files Added
1. `.github/workflows/deploy.yml` — GitHub Actions workflow
2. `.nojekyll` — Tells GitHub Pages to skip Jekyll processing

---

## 📍 Your Website URL

Once deployment is complete, your site will be available at:

```
https://botlychat.github.io/hospitality-dashboard/
```

or directly to dashboard:

```
https://botlychat.github.io/hospitality-dashboard/dashboard.html
```

---

## ⚙️ GitHub Pages Settings (One-time setup)

1. Go to your repository: **https://github.com/botlychat/hospitality-dashboard**
2. Navigate to **Settings → Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (or "Deploy from a branch" if preferred)
   - **Branch**: Select `main` (if using branch deployment)
4. Click **Save**

---

## 🔄 Deployment Status

To monitor deployments:

1. Go to your repository
2. Click **Actions** tab
3. You'll see "Deploy to GitHub Pages" workflow runs
4. Each push to `main` triggers a new deployment

---

## 📝 Base Path Configuration

Your repository has a `<base href="/hospitality-dashboard/">` set in all HTML files, which means:
- ✅ Correct: Routes work from `/hospitality-dashboard/` subdirectory
- ✅ All links are relative to this path

**If you change repository name**, you'll need to update all `<base href="">` tags.

---

## 🧪 Testing Deployment

After pushing changes:

1. Go to **Actions** tab → check workflow status
2. Wait for green ✅ checkmark (usually < 1 minute)
3. Visit: `https://botlychat.github.io/hospitality-dashboard/dashboard.html`
4. Hard refresh browser if changes don't appear: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## 🔗 Next Steps

### Test locally first
```bash
cd c:\Users\ahmad_xk7dsla\Documents\GitHub\hospitality-dashboard
python -m http.server 8000
# Visit: http://localhost:8000/hospitality-dashboard/dashboard.html
```

### Push to GitHub
```bash
git add .github/workflows/deploy.yml .nojekyll
git commit -m "ci: Configure GitHub Pages deployment workflow"
git push
```

### Monitor deployment
- Check GitHub Actions → Deploy to GitHub Pages workflow
- Once complete ✅, visit your live site

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| **404 Not Found** | Check workflow status; ensure push was successful |
| **Styling broken** | Hard refresh (Ctrl+Shift+R); check CSS file paths |
| **Links broken** | Verify `<base href="/hospitality-dashboard/">` in HTML |
| **Old content showing** | Clear browser cache; hard refresh |
| **Workflow fails** | Check Actions tab for error messages; commit has syntax error |

---

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

**Setup Date**: 2025-10-28  
**Status**: ✅ Ready for deployment  
**Repository**: botlychat/hospitality-dashboard  
**Branch**: main
