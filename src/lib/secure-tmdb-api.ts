// Secure TMDB API service
// This file should only be used on the server side or with proper environment variable handling

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
  popularity?: number
  backdrop_path?: string
  adult?: boolean
  original_language?: string
  original_title?: string
  video?: boolean
}

export interface MovieSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// Get poster URL with different sizes
export function getPosterUrl(posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!posterPath) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
}

// Get backdrop URL with different sizes
export function getBackdropUrl(backdropPath: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!backdropPath) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
}

// Secure API call function
async function secureApiCall(endpoint: string, params: Record<string, string> = {}) {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
  
  if (!TMDB_API_KEY || TMDB_API_KEY === 'your-tmdb-api-key-here') {
    throw new Error('TMDB API key not configured. Please set VITE_TMDB_API_KEY in your .env file')
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...params
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error calling TMDB API:', error)
    throw error
  }
}

// Search movies by title
export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return []
  
  try {
    const data: MovieSearchResult = await secureApiCall('/search/movie', {
      query: query.trim(),
      page: '1',
      include_adult: 'false'
    })
    return data.results
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<MovieSearchResult> {
  try {
    return await secureApiCall('/movie/popular', { page: page.toString() })
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Get trending movies (daily or weekly)
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<MovieSearchResult> {
  try {
    return await secureApiCall(`/trending/movie/${timeWindow}`, { page: page.toString() })
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Get top rated movies
export async function getTopRatedMovies(page: number = 1): Promise<MovieSearchResult> {
  try {
    return await secureApiCall('/movie/top_rated', { page: page.toString() })
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Get now playing movies
export async function getNowPlayingMovies(page: number = 1): Promise<MovieSearchResult> {
  try {
    return await secureApiCall('/movie/now_playing', { page: page.toString() })
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Get movie details by TMDB ID
export async function getMovieDetails(tmdbId: number): Promise<TMDBMovie | null> {
  try {
    return await secureApiCall(`/movie/${tmdbId}`)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
} 