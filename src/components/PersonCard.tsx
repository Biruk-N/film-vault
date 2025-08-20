import { useState } from 'react'
import { User, Film, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Person } from '~/lib/secure-tmdb-api'
import { getProfileUrl, getPosterUrl } from '~/lib/secure-tmdb-api'
import { usePersonMovies } from '~/hooks/useTMDB'

interface PersonCardProps {
  person: Person
}

export function PersonCard({ person }: PersonCardProps) {
  const profileUrl = person.profile_path ? getProfileUrl(person.profile_path, 'w185') : null
  const [expanded, setExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [type, setType] = useState<'all' | 'cast' | 'crew'>('all')
  const perPage = 10
  const { data, isLoading, error } = usePersonMovies(person.id, page, type, perPage, { enabled: expanded })

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

          {/* Toggle Filmography */}
          <div className="mt-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {expanded ? 'Hide Filmography' : 'Show Filmography'}
            </button>
          </div>

          {/* Filmography Panel */}
          {expanded && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              {/* Filters */}
              <div className="mb-3 flex flex-wrap gap-2">
                {(['all', 'cast', 'crew'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setType(t); setPage(1) }}
                    className={`px-3 py-1 rounded text-xs font-medium ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                  >
                    {t === 'all' ? 'All' : t === 'cast' ? 'Cast' : 'Crew'}
                  </button>
                ))}
              </div>

              {/* Content */}
              {error && (
                <p className="text-red-400 text-sm">Failed to load filmography</p>
              )}
              {isLoading && (
                <p className="text-gray-400 text-sm">Loading filmography...</p>
              )}
              {data && (
                <>
                  <ul className="space-y-2">
                    {data.results.map((m) => (
                      <li key={m.id} className="flex items-center gap-3">
                        <img
                          src={getPosterUrl(m.poster_path || '', 'w92') || 'https://via.placeholder.com/92x138/374151/9CA3AF?text=No+Image'}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded"
                          loading="lazy"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement
                            t.src = 'https://via.placeholder.com/92x138/374151/9CA3AF?text=No+Image'
                          }}
                        />
                        <div className="min-w-0">
                          <Link
                            to="/movie/$movieId"
                            params={{ movieId: String(m.id) }}
                            className="text-sm text-white hover:underline truncate block"
                          >
                            {m.title}
                          </Link>
                          <div className="text-xs text-gray-400 truncate">
                            {m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'}
                            {m.role ? ` • ${m.role}` : ''}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Pagination */}
                  {data.total_pages > 1 && (
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`px-3 py-1 rounded text-sm ${page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        Previous
                      </button>
                      <span className="text-gray-400 text-xs">Page {page} of {data.total_pages}</span>
                      <button
                        disabled={page >= data.total_pages}
                        onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                        className={`px-3 py-1 rounded text-sm ${page >= data.total_pages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}