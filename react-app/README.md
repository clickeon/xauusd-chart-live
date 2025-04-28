# Deploying XAUUSD Chart Live to Netlify

This guide explains how to deploy the XAUUSD Chart Live application to Netlify.

## Prerequisites

- A Netlify account
- The project repository pushed to GitHub

## Deployment Steps

### 1. Prepare for deployment

The following files have been configured for Netlify deployment:
- `netlify.toml` - Contains build settings and redirects
- `.env.production` - Contains production environment variables
- `vite.config.js` - Configured to build to the `dist` directory

### 2. Deploy to Netlify

#### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select your Git provider (GitHub)
4. Authorize Netlify to access your repository
5. Select the XAUUSD Chart Live repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

3. Log in to Netlify:
   ```bash
   netlify login
   ```

4. Initialize the Netlify site:
   ```bash
   netlify init
   ```

5. Follow the prompts to configure your site

### 3. Configure Environment Variables

After deployment, set up the API URL environment variable:

1. Go to your site's Netlify dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add the variable:
   - Key: `VITE_API_URL`
   - Value: Your API backend URL (e.g., `https://xauusd-api.herokuapp.com`)

### 4. Backend Deployment

The React frontend will need to connect to a backend API server. Options for deploying the backend include:

- Heroku (configured in the `.env.production` file as the default)
- Railway
- Render
- AWS
- Google Cloud Run

Make sure to update the `VITE_API_URL` environment variable in Netlify to point to your deployed backend.

## Troubleshooting

- **API Connection Issues**: Check that CORS is properly configured on your backend
- **Routing Problems**: The `netlify.toml` file contains redirects to handle client-side routing
- **Build Failures**: Check the build logs in Netlify for specific errors
