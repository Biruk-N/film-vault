export const seo = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}: {
  title: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'movie'
}) => {
  const baseUrl = 'https://film-vault-popular.netlify.app'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const defaultImage = `${baseUrl}/favicon.png`
  const googleSiteVerify = import.meta.env.VITE_GOOGLE_SITE_VERIFY
  
  const tags = [
    // Basic Meta Tags
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'FilmVault' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    
    // Google Site Verification
    ...(googleSiteVerify ? [{ name: 'google-site-verification', content: googleSiteVerify }] : []),
    
    // Open Graph Tags (Facebook, LinkedIn)
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: image || defaultImage },
    { property: 'og:site_name', content: 'FilmVault' },
    { property: 'og:locale', content: 'en_US' },
    
    // Twitter Card Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image || defaultImage },
    { name: 'twitter:site', content: '@filmvault' },
    { name: 'twitter:creator', content: '@filmvault' },
    
    // Additional SEO Tags
    { name: 'application-name', content: 'FilmVault' },
    { name: 'theme-color', content: '#1f2937' },
    { name: 'msapplication-TileColor', content: '#1f2937' },
    
    // Canonical URL
    { rel: 'canonical', href: fullUrl },
  ]

  return tags
}

// IMDb-style SEO presets for different pages
export const seoPresets = {
  home: {
    title: 'FilmVault: Discover Trending & Popular Movies | Real-time Movie Database',
    description: 'Explore the latest trending and most popular movies from around the world. Browse thousands of films with ratings, reviews, and high-quality posters. Your ultimate movie discovery platform.',
    keywords: 'movies, trending movies, popular movies, movie database, film discovery, movie ratings, movie reviews, watch movies, new movies, top movies',
    url: '/'
  },
  
  movies: {
    title: 'Browse Movies: Popular, Trending, Top Rated & Now Playing | FilmVault',
    description: 'Browse thousands of movies by category: Popular, Trending, Top Rated, and Now Playing. Discover new films with detailed information, ratings, and release dates.',
    keywords: 'browse movies, popular movies, trending movies, top rated movies, now playing movies, movie categories, film browsing',
    url: '/movies'
  },
  
  search: {
    title: 'Search Movies: Find Your Favorite Films | FilmVault',
    description: 'Search through thousands of movies in our comprehensive database. Find films by title, discover new releases, and explore movie details with ratings and reviews.',
    keywords: 'search movies, find movies, movie search, film search, actor search, director search, crew search, movie database search, discover movies',
    url: '/search'
  },
  
  movieDetails: (movieTitle: string, year?: string) => ({
    title: `${movieTitle}${year ? ` (${year})` : ''} - Movie Details, Ratings & Reviews | FilmVault`,
    description: `Watch ${movieTitle}${year ? ` (${year})` : ''} - Get movie details, ratings, reviews, cast information, and where to watch. Discover everything about this film on FilmVault.`,
    keywords: `${movieTitle}, movie, film, watch ${movieTitle}, movie details, movie ratings, movie reviews, ${year || ''}`,
    type: 'movie' as const
  })
}

// Generate structured data for movies (JSON-LD)
export const generateMovieStructuredData = (movie: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
      bestRating: 10,
      worstRating: 0
    },
    director: {
      '@type': 'Person',
      name: 'Various Directors'
    },
    genre: movie.genre_ids ? movie.genre_ids.map((id: number) => getGenreName(id)) : [],
    url: `https://film-vault-popular.netlify.app/movie/${movie.id}`
  }
}

// Helper function to get genre names (you can expand this)
const getGenreName = (genreId: number): string => {
  const genres: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  }
  return genres[genreId] || 'Unknown'
}
