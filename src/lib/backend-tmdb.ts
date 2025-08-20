import type { MovieSearchResult, TMDBMovie, MovieCredits, MultiSearchResult, Person } from '~/lib/secure-tmdb-api'

async function api<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  const body = await res.json()
  if (!body?.success) {
    const msg = body?.error?.message || 'Unknown error'
    throw new Error(msg)
  }
  return body.data as T
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  const data = await api<{ results: TMDBMovie[]; page: number; total_pages: number; total_results: number }>(`/api/tmdb/search?query=${encodeURIComponent(query)}`)
  return data.results
}

export async function multiSearch(query: string): Promise<MultiSearchResult> {
  return api<MultiSearchResult>(`/api/tmdb/multi-search?query=${encodeURIComponent(query)}`)
}

export async function searchPeople(query: string): Promise<Person[]> {
  return api<Person[]>(`/api/tmdb/people/search?query=${encodeURIComponent(query)}`)
}

export async function getPopularMovies(page = 1): Promise<MovieSearchResult> {
  return api<MovieSearchResult>(`/api/tmdb/movies/popular?page=${page}`)
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page = 1): Promise<MovieSearchResult> {
  return api<MovieSearchResult>(`/api/tmdb/movies/trending?timeWindow=${timeWindow}&page=${page}`)
}

export async function getTopRatedMovies(page = 1): Promise<MovieSearchResult> {
  return api<MovieSearchResult>(`/api/tmdb/movies/top-rated?page=${page}`)
}

export async function getNowPlayingMovies(page = 1): Promise<MovieSearchResult> {
  return api<MovieSearchResult>(`/api/tmdb/movies/now-playing?page=${page}`)
}

export async function getUpcomingMovies(page = 1): Promise<MovieSearchResult> {
  return api<MovieSearchResult>(`/api/tmdb/movies/upcoming?page=${page}`)
}

export async function getMovieDetails(tmdbId: number): Promise<TMDBMovie | null> {
  return api<TMDBMovie | null>(`/api/tmdb/movies/${tmdbId}`)
}

export async function getMovieCredits(tmdbId: number): Promise<MovieCredits | null> {
  return api<MovieCredits | null>(`/api/tmdb/movies/${tmdbId}/credits`)
}

export async function getPersonMovies(
  personId: number,
  page = 1,
  perPage = 20,
  type: 'all' | 'cast' | 'crew' = 'all',
): Promise<{ page: number; total_pages: number; total_results: number; results: Array<TMDBMovie & { role?: string; department?: string }> }> {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage), type })
  return api(`/api/tmdb/people/${personId}/movies?${params.toString()}`)
}
