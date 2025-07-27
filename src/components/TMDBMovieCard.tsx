import { ExternalLink, Star, Calendar, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { TMDBMovie } from '~/lib/secure-tmdb-api'
import { getPosterUrl, getProfileUrl } from '~/lib/secure-tmdb-api'
import { GenreBadges } from './GenreBadges'
import { extractGenreIds } from '~/lib/genres'

interface TMDBMovieCardProps {
  movie: TMDBMovie
  rank?: number
}

export function TMDBMovieCard({ movie, rank }: TMDBMovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, 'w500')
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'
  
  // Check if this is an upcoming movie (release date is in the future)
  const isUpcoming = movie.release_date ? new Date(movie.release_date) > new Date() : false

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

        {/* Rating Badge - Only show for released movies */}
        {!isUpcoming && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-sm font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            {rating}
          </div>
        )}
        
        {/* Upcoming Badge - Show for upcoming movies */}
        {isUpcoming && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Calendar size={12} />
            Coming Soon
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight">
            {movie.title}
          </h3>
        </div>

        {/* Movie Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={14} className="mr-1" />
            {releaseYear}
          </div>
          
          {movie.vote_count && !isUpcoming && (
            <div className="flex items-center text-gray-400 text-sm">
              <Users size={14} className="mr-1" />
              {movie.vote_count.toLocaleString()} votes
            </div>
          )}
        </div>

        {/* Genres */}
        {(() => {
          const genreIds = extractGenreIds(movie)
          return genreIds.length > 0 ? (
            <div className="mb-3">
              <GenreBadges 
                genreIds={genreIds} 
                maxDisplay={3} 
                showIcon={false} 
                expandable={true} 
              />
            </div>
          ) : null
        })()}

        {/* Overview */}
        {movie.overview && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {movie.overview}
          </p>
        )}
        
        <div className="flex gap-2 mt-3">
          <Link 
            to="/movie/$movieId"
            params={{ movieId: movie.id.toString() }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 