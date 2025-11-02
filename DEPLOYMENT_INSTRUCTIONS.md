# Deployment Instructions

## GitHub Setup

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `final_img_gen` (or your preferred name)
   - Choose Public or Private
   - **Do NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code to GitHub:**
   After creating the repository, run these commands (replace `YOUR_USERNAME` with your GitHub username):

   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/final_img_gen.git
   git branch -M main
   git push -u origin main
   ```

   If you chose a different repository name, replace `final_img_gen` in the URL.

## Netlify Deployment

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub first** (follow steps above)

2. **Go to Netlify:**
   - Visit https://app.netlify.com
   - Sign in with your GitHub account (or create an account)

3. **Add a new site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories
   - Select the `final_img_gen` repository

4. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Netlify should auto-detect these from `netlify.toml`

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your site automatically

### Option 2: Deploy via Netlify CLI

If you prefer using the command line:

1. **Install Netlify CLI:**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```powershell
   netlify login
   ```

3. **Initialize and deploy:**
   ```powershell
   netlify init
   netlify deploy --prod
   ```

## Environment Variables (if needed)

If your app uses environment variables (like API keys), add them in Netlify:

1. Go to your site in Netlify dashboard
2. Site settings → Build & deploy → Environment variables
3. Add your variables (e.g., `VITE_API_KEY`)

## Post-Deployment

- Your site will get a URL like: `https://your-site-name.netlify.app`
- You can set up a custom domain in Site settings → Domain management
- Every push to the main branch will trigger a new deployment automatically

## Troubleshooting

- **Build fails:** Check the build logs in Netlify dashboard
- **404 errors:** Make sure `netlify.toml` is configured correctly
- **API issues:** Check if environment variables are set correctly

