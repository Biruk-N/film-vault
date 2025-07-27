import { Users, User, Award } from 'lucide-react'
import type { CastMember } from '~/lib/secure-tmdb-api'
import { getProfileUrl } from '~/lib/secure-tmdb-api'

interface CrewSectionProps {
  crew: CastMember[]
  title?: string
  maxDisplay?: number
}

export function CrewSection({ crew, title = "Crew", maxDisplay = 6 }: CrewSectionProps) {
  if (!crew || crew.length === 0) {
    return null
  }

  // Filter for key crew members (directors, producers, writers)
  const keyCrew = crew.filter(member => 
    member.known_for_department === 'Directing' || 
    member.known_for_department === 'Production' ||
    member.known_for_department === 'Writing'
  ).slice(0, maxDisplay)

  if (keyCrew.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Award className="mr-2" size={24} />
        {title}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {keyCrew.map((member) => (
          <div key={member.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                {member.profile_path ? (
                  <img
                    src={getProfileUrl(member.profile_path, 'w92')}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/92x92/374151/9CA3AF?text=No+Image'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User className="text-gray-500" size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {member.known_for_department}
                </p>
                {member.character && (
                  <p className="text-gray-500 text-xs line-clamp-1">
                    {member.character}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 