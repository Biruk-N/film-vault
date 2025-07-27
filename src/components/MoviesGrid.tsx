import { MovieCard } from './MovieCard'
import { TMDBMovieCard } from './TMDBMovieCard'
import type { Movie } from '~/lib/movies-data'
import type { TMDBMovie } from '~/lib/secure-tmdb-api'

interface MoviesGridProps {
  movies: (Movie | TMDBMovie)[]
  showRank?: boolean
}

export function MoviesGrid({ movies, showRank = false }: MoviesGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold mb-2">No movies found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {movies.map((movie, index) => {
        // Check if it's a TMDBMovie by looking for TMDB-specific properties
        const isTMDBMovie = 'poster_path' in movie && 'vote_average' in movie
        
        if (isTMDBMovie) {
          return (
            <TMDBMovieCard 
              key={movie.id} 
              movie={movie as TMDBMovie} 
              rank={showRank ? index + 1 : undefined}
            />
          )
        } else {
          return (
            <MovieCard 
              key={movie.id} 
              movie={movie as Movie} 
              rank={showRank ? index + 1 : undefined}
            />
          )
        }
      })}
    </div>
  )
} 