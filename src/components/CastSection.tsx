import { Users, User } from 'lucide-react'
import type { CastMember } from '~/lib/secure-tmdb-api'
import { getProfileUrl } from '~/lib/secure-tmdb-api'

interface CastSectionProps {
  cast: CastMember[]
  title?: string
  maxDisplay?: number
}

export function CastSection({ cast, title = "Cast", maxDisplay = 10 }: CastSectionProps) {
  if (!cast || cast.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Users className="mr-2" size={24} />
          {title}
        </h2>
        <p className="text-gray-400">No cast information available.</p>
      </div>
    )
  }

  const displayCast = cast.slice(0, maxDisplay)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Users className="mr-2" size={24} />
        {title} ({cast.length})
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayCast.map((member) => (
          <div key={member.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
            <div className="aspect-square relative">
              {member.profile_path ? (
                <img
                  src={getProfileUrl(member.profile_path, 'w185')}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/185x185/374151/9CA3AF?text=No+Image'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User className="text-gray-500" size={48} />
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                {member.name}
              </h3>
              <p className="text-gray-400 text-xs line-clamp-2">
                {member.character}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {cast.length > maxDisplay && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Showing {maxDisplay} of {cast.length} cast members
          </p>
        </div>
      )}
    </div>
  )
} 