// TMDB API configuration
const TMDB_API_KEY = 'your-tmdb-api-key-here' // You'll need to get this from https://www.themoviedb.org/settings/api
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Movie interface with TMDB data
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface MovieSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// Extract IMDb ID from URL
export function extractImdbId(imdbUrl: string): string | null {
  const match = imdbUrl.match(/\/title\/(tt\d+)/)
  return match ? match[1] : null
}

// Get poster URL with different sizes
export function getPosterUrl(posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!posterPath) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

// Search movies by title
export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return []
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    )
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    const data: MovieSearchResult = await response.json()
    return data.results
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

// Get movie by IMDb ID
export async function getMovieByImdbId(imdbId: string): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`
    )
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.movie_results[0] || null
  } catch (error) {
    console.error('Error fetching movie by IMDb ID:', error)
    return null
  }
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<MovieSearchResult> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    )
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Get movie details by TMDB ID
export async function getMovieDetails(tmdbId: number): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
} 