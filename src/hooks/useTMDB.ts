import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  searchMovies, 
  getMovieByImdbId, 
  getPopularMovies, 
  getMovieDetails,
  type TMDBMovie 
} from '~/lib/tmdb-api'

// Query keys
export const tmdbKeys = {
  all: ['tmdb'] as const,
  movies: () => [...tmdbKeys.all, 'movies'] as const,
  search: (query: string) => [...tmdbKeys.movies(), 'search', query] as const,
  movie: (id: number) => [...tmdbKeys.movies(), 'movie', id] as const,
  popular: (page: number) => [...tmdbKeys.movies(), 'popular', page] as const,
  byImdbId: (imdbId: string) => [...tmdbKeys.movies(), 'imdb', imdbId] as const,
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

// Hook for getting movie by IMDb ID
export function useMovieByImdbId(imdbId: string | null) {
  return useQuery({
    queryKey: tmdbKeys.byImdbId(imdbId || ''),
    queryFn: () => getMovieByImdbId(imdbId!),
    enabled: !!imdbId,
    staleTime: 10 * 60 * 1000, // 10 minutes
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

// Hook for getting movie details
export function useMovieDetails(tmdbId: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movie(tmdbId || 0),
    queryFn: () => getMovieDetails(tmdbId!),
    enabled: !!tmdbId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for prefetching movie data
export function usePrefetchMovie() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (imdbId: string) => {
      const movie = await getMovieByImdbId(imdbId)
      if (movie) {
        queryClient.setQueryData(tmdbKeys.byImdbId(imdbId), movie)
      }
      return movie
    },
  })
} 