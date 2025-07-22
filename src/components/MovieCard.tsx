import { ExternalLink } from 'lucide-react'
import type { Movie } from '~/lib/movies-data'

interface MovieCardProps {
  movie: Movie
  rank?: number
}

export function MovieCard({ movie, rank }: MovieCardProps) {
  const extractImdbId = (url: string) => {
    const match = url.match(/\/title\/(tt\d+)/)
    return match ? match[1] : null
  }

  const imdbId = extractImdbId(movie.imdb_url)

  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
      <div className="aspect-[2/3] relative">
        <img 
          src={movie.poster_url} 
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
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight">
            {movie.title}
          </h3>
        </div>
        
        <div className="flex gap-2 mt-3">
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