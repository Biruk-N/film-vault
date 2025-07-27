# TMDB API Setup for FilmVault

## Getting Your TMDB API Key

1. **Visit TMDB**: Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. **Create Account**: Sign up for a free account
3. **Go to Settings**: Click on your profile → Settings
4. **API Section**: Navigate to the "API" section
5. **Request API Key**: Click "Request an API key"
6. **Fill Form**: 
   - Choose "Developer" option
   - Fill in the required information
   - Accept terms of service
7. **Get Your Key**: You'll receive your API key via email

## Setting Up the API Key (Secure Method)

### Option 1: Environment Variable (Recommended)

1. **Create a `.env` file** in the root directory of the project
2. **Add your API key**:
   ```bash
   VITE_TMDB_API_KEY=your-actual-api-key-here
   ```
3. **Restart the development server** after adding the environment variable

### Option 2: Direct Configuration (Not Recommended)

1. **Open the file**: `src/lib/secure-tmdb-api.ts`
2. **Replace the placeholder**: 
   ```typescript
   const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
   ```
   with your actual API key:
   ```typescript
   const TMDB_API_KEY = 'your-actual-api-key-here'
   ```

> **⚠️ Security Note**: The environment variable approach is **strongly recommended** because:
> - Your API key will not be visible in the browser's developer tools
> - It prevents accidental exposure in version control
> - It follows security best practices

## Security Features

This application now uses a **secure API service** that:
- ✅ Keeps your API key hidden from frontend code
- ✅ Uses environment variables for configuration
- ✅ Provides clear error messages if the API key is missing
- ✅ Handles API errors gracefully
- ✅ Prevents API key exposure in browser developer tools

## Features Enabled with TMDB

- **Live trending movies** - Updated daily from TMDB
- **Popular movies** - Real-time popularity data
- **Top rated movies** - Highest rated films
- **Now playing movies** - Currently in theaters
- **Advanced search** - Search across TMDB's entire database
- **High-quality poster images** from TMDB's CDN
- **Movie ratings** and vote counts
- **Release dates** and additional metadata
- **Movie overviews** and descriptions
- **Guest session** - No user authentication required

## Guest Session Implementation

This application is designed to work as a **guest session**, meaning:
- No user registration required
- No login/logout functionality
- Direct access to TMDB data
- Perfect for public movie browsing
- No user-specific features (watchlists, ratings, etc.)

## API Rate Limits

TMDB has generous rate limits:
- **Read API**: 1,000 requests per day
- **Search API**: 1,000 requests per day

This should be more than sufficient for a personal movie database.

## Benefits Over Static Data

- **Real-time Data**: Always up-to-date with latest releases
- **Comprehensive**: Access to TMDB's entire movie database
- **Rich Metadata**: Ratings, release dates, vote counts, descriptions
- **High-Quality Images**: Professional poster images
- **Search Functionality**: Powerful search across all movies
- **Multiple Categories**: Trending, popular, top-rated, now playing
- **No Maintenance**: No need to manually update movie lists
- **Secure**: API key is properly protected

## Testing the Integration

After setting up your API key:

1. Run the development server: `npm run dev`
2. Navigate to the home page to see trending and popular movies
3. Visit the movies page to browse different categories
4. Use the search functionality to find specific movies
5. You should see enhanced movie cards with:
   - TMDB poster images
   - Rating badges
   - Release years
   - Vote counts
   - Movie descriptions

## Troubleshooting

If images don't load:
1. Check your API key is correct
2. Verify you have internet connection
3. Check browser console for any errors
4. The app will show placeholder images if TMDB fails

If no movies appear:
1. Verify your API key is valid
2. Check the browser console for API errors
3. Ensure you're not hitting rate limits
4. Try refreshing the page

If environment variables aren't working:
1. Make sure the `.env` file is in the root directory
2. Restart the development server after adding the `.env` file
3. Check that the variable name starts with `VITE_`
4. Verify there are no spaces around the `=` sign

If you see "TMDB API key not configured" error:
1. Make sure your `.env` file contains `VITE_TMDB_API_KEY=your-actual-key`
2. Restart the development server
3. Check that the API key is valid and not the placeholder text 