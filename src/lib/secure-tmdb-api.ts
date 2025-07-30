// Secure TMDB API service
// This file should only be used on the server side or with proper environment variable handling

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Genre interface
export interface Genre {
  id: number
  name: string
}

// Movie interface with TMDB data
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: Genre[]
  popularity?: number
  backdrop_path?: string
  adult?: boolean
  original_language?: string
  original_title?: string
  video?: boolean
  imdb_id?: string
}

// Cast member interface
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department: string
}

// Person interface for search results
export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  known_for: Array<{
    id: number
    title?: string
    name?: string
    media_type: string
  }>
}

// Credits interface
export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: CastMember[]
}

// Multi-search result interface
export interface MultiSearchResult {
  page: number
  results: Array<{
    id: number
    media_type: 'movie' | 'person' | 'tv'
    title?: string
    name?: string
    profile_path?: string | null
    poster_path?: string | null
    known_for_department?: string
    popularity?: number
    release_date?: string
    vote_average?: number
    vote_count?: number
    overview?: string
    genre_ids?: number[]
    adult?: boolean
    original_language?: string
    original_title?: string
    video?: boolean
  }>
  total_pages: number
  total_results: number
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

// Get profile URL with different sizes
export function getProfileUrl(profilePath: string, size: 'w45' | 'w92' | 'w185' | 'h632' | 'w632' | 'original' = 'w185'): string {
  if (!profilePath) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`
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

// Multi-search across movies, people, and TV shows
export async function multiSearch(query: string): Promise<MultiSearchResult> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
  
  try {
    const data: MultiSearchResult = await secureApiCall('/search/multi', {
      query: query.trim(),
      page: '1',
      include_adult: 'false'
    })
    return data
  } catch (error) {
    console.error('Error performing multi-search:', error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Search people (actors, directors, etc.)
export async function searchPeople(query: string): Promise<Person[]> {
  if (!query.trim()) return []
  
  try {
    const data = await secureApiCall('/search/person', {
      query: query.trim(),
      page: '1',
      include_adult: 'false'
    })
    return data.results
  } catch (error) {
    console.error('Error searching people:', error)
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

// Get upcoming movies
export async function getUpcomingMovies(page: number = 1): Promise<MovieSearchResult> {
  try {
    return await secureApiCall('/movie/upcoming', { page: page.toString() })
  } catch (error) {
    console.error('Error fetching upcoming movies:', error)
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

// Get movie credits (cast and crew) by TMDB ID
export async function getMovieCredits(tmdbId: number): Promise<MovieCredits | null> {
  try {
    return await secureApiCall(`/movie/${tmdbId}/credits`)
  } catch (error) {
    console.error('Error fetching movie credits:', error)
    return null
  }
} 