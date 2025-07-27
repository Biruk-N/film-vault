import { useState } from 'react'
import { Tag } from 'lucide-react'
import { getGenreNames } from '~/lib/genres'

interface GenreBadgesProps {
  genreIds: number[]
  maxDisplay?: number
  showIcon?: boolean
  expandable?: boolean
}

export function GenreBadges({ genreIds, maxDisplay = 5, showIcon = true, expandable = false }: GenreBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!genreIds || genreIds.length === 0) {
    return null
  }

  const genres = getGenreNames(genreIds)
  const displayGenres = isExpanded ? genres : genres.slice(0, maxDisplay)
  const hasMore = genres.length > maxDisplay

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showIcon && (
        <Tag className="text-gray-400" size={16} />
      )}
      {displayGenres.map((genre, index) => (
        <span
          key={index}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-full font-medium transition-colors"
        >
          {genre}
        </span>
      ))}
      {hasMore && !isExpanded && expandable && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors cursor-pointer"
        >
          +{genres.length - maxDisplay} more
        </button>
      )}
      {isExpanded && expandable && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-300 text-xs font-medium transition-colors cursor-pointer"
        >
          Show less
        </button>
      )}
    </div>
  )
} 