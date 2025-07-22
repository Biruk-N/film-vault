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

## Setting Up the API Key

1. **Open the file**: `src/lib/tmdb-api.ts`
2. **Replace the placeholder**: 
   ```typescript
   const TMDB_API_KEY = 'your-tmdb-api-key-here'
   ```
   with your actual API key:
   ```typescript
   const TMDB_API_KEY = 'your-actual-api-key-here'
   ```

## Features Enabled with TMDB

- **High-quality poster images** from TMDB's CDN
- **Movie ratings** and vote counts
- **Release dates** and additional metadata
- **Movie overviews** and descriptions
- **Fallback support** - if TMDB data isn't available, falls back to original data

## API Rate Limits

TMDB has generous rate limits:
- **Read API**: 1,000 requests per day
- **Search API**: 1,000 requests per day

This should be more than sufficient for a personal movie database.

## Benefits Over Amazon Media URLs

- **Reliable**: TMDB is specifically designed for movie data
- **Legal**: Proper licensing and terms of service
- **Fast**: CDN-optimized image delivery
- **Rich Data**: Additional metadata like ratings, release dates, etc.
- **No CORS Issues**: TMDB allows cross-origin requests
- **Future-proof**: Stable API with good documentation

## Testing the Integration

After setting up your API key:

1. Run the development server: `npm run dev`
2. Navigate to the movies page
3. You should see enhanced movie cards with:
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
4. The app will fallback to original poster URLs if TMDB fails 