import { User, Film, Award } from 'lucide-react'
import type { Person } from '~/lib/secure-tmdb-api'
import { getProfileUrl } from '~/lib/secure-tmdb-api'

interface PersonCardProps {
  person: Person
}

export function PersonCard({ person }: PersonCardProps) {
  const profileUrl = person.profile_path ? getProfileUrl(person.profile_path, 'w185') : null
  
  // Get known for movies (limit to 5 for better discovery)
  const knownForMovies = person.known_for
    .filter(item => item.media_type === 'movie')
    .slice(0, 5)
    .map(item => ({ id: item.id, title: item.title || item.name }))
    .filter(item => item.title)

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
      <div className="flex">
        {/* Profile Image */}
        <div className="w-20 h-20 flex-shrink-0">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={person.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://via.placeholder.com/185x185/374151/9CA3AF?text=No+Image'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <User className="text-gray-500" size={32} />
            </div>
          )}
        </div>
        
        {/* Person Info */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight">
              {person.name}
            </h3>
            <div className="flex items-center text-gray-400 text-xs ml-2">
              <Award className="mr-1" size={12} />
              {person.known_for_department}
            </div>
          </div>
          
          {/* Known For Movies - Clickable Links */}
          {knownForMovies.length > 0 && (
            <div className="mb-2">
              <p className="text-gray-400 text-xs mb-1">Movies with this actor:</p>
              <div className="flex flex-wrap gap-1">
                {knownForMovies.map((movie) => (
                  <a
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
                  >
                    {movie.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Popularity */}
          <div className="flex items-center text-gray-400 text-xs">
            <Film className="mr-1" size={12} />
            Popularity: {person.popularity?.toFixed(0) || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
} 