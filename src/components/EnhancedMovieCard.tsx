import { ExternalLink, Star, Calendar, Users } from 'lucide-react'
import { extractImdbId, getPosterUrl } from '~/lib/tmdb-api'
import { useMovieByImdbId } from '~/hooks/useTMDB'
import type { Movie } from '~/lib/movies-data'

interface EnhancedMovieCardProps {
  movie: Movie
  rank?: number
}

export function EnhancedMovieCard({ movie, rank }: EnhancedMovieCardProps) {
  const imdbId = extractImdbId(movie.imdb_url)
  const { data: tmdbMovie, isLoading, error } = useMovieByImdbId(imdbId)
  
  // Use TMDB poster if available, otherwise fallback to original
  const posterUrl = tmdbMovie?.poster_path 
    ? getPosterUrl(tmdbMovie.poster_path, 'w500')
    : movie.poster_url

  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
      <div className="aspect-[2/3] relative">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {rank && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full">
            #{rank}
          </div>
        )}

        {/* TMDB Rating Badge */}
        {tmdbMovie?.vote_average && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            {tmdbMovie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight">
            {movie.title}
          </h3>
        </div>
        
        {/* TMDB Additional Info */}
        {tmdbMovie && (
          <div className="mb-3 space-y-1">
            {tmdbMovie.release_date && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={14} />
                {new Date(tmdbMovie.release_date).getFullYear()}
              </div>
            )}
            {tmdbMovie.vote_count && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Users size={14} />
                {tmdbMovie.vote_count.toLocaleString()} votes
              </div>
            )}
            {tmdbMovie.overview && (
              <p className="text-gray-400 text-sm line-clamp-2">
                {tmdbMovie.overview}
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <a 
            href={movie.imdb_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            View on IMDB
          </a>
        </div>
      </div>
    </div>
  )
} 