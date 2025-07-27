import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  searchMovies, 
  getPopularMovies, 
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getMovieDetails,
  type TMDBMovie 
} from '~/lib/secure-tmdb-api'

// Query keys
export const tmdbKeys = {
  all: ['tmdb'] as const,
  movies: () => [...tmdbKeys.all, 'movies'] as const,
  search: (query: string) => [...tmdbKeys.movies(), 'search', query] as const,
  movie: (id: number) => [...tmdbKeys.movies(), 'movie', id] as const,
  popular: (page: number) => [...tmdbKeys.movies(), 'popular', page] as const,
  trending: (timeWindow: string, page: number) => [...tmdbKeys.movies(), 'trending', timeWindow, page] as const,
  topRated: (page: number) => [...tmdbKeys.movies(), 'topRated', page] as const,
  nowPlaying: (page: number) => [...tmdbKeys.movies(), 'nowPlaying', page] as const,
}

// Hook for searching movies
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: tmdbKeys.search(query),
    queryFn: () => searchMovies(query),
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting popular movies
export function usePopularMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.popular(page),
    queryFn: () => getPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting trending movies
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.trending(timeWindow, page),
    queryFn: () => getTrendingMovies(timeWindow, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting top rated movies
export function useTopRatedMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.topRated(page),
    queryFn: () => getTopRatedMovies(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for getting now playing movies
export function useNowPlayingMovies(page: number = 1) {
  return useQuery({
    queryKey: tmdbKeys.nowPlaying(page),
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for getting movie details
export function useMovieDetails(tmdbId: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movie(tmdbId || 0),
    queryFn: () => getMovieDetails(tmdbId!),
    enabled: !!tmdbId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
} 