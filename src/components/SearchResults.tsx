import { useState } from 'react'
import { Film, Users, Filter } from 'lucide-react'
import { PersonCard } from './PersonCard'
import { GenreBadges } from './GenreBadges'
import type { MultiSearchResult } from '~/lib/secure-tmdb-api'

interface SearchResultsProps {
  movies: MultiSearchResult['results']
  people: any[]
  isLoading: boolean
  searchQuery: string
}

type FilterType = 'all' | 'movies' | 'people'

export function SearchResults({ movies, people, isLoading, searchQuery }: SearchResultsProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredMovies = filter === 'all' || filter === 'movies' ? movies : []
  const filteredPeople = filter === 'all' || filter === 'people' ? people : []
  
  const totalResults = filteredMovies.length + filteredPeople.length

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Searching...</p>
      </div>
    )
  }

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Film className="mb-4" size={48} />
        <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
        <p>Search for movies, actors, directors, and more</p>
      </div>
    )
  }

  if (totalResults === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Film className="mb-4" size={48} />
        <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
        <p>Try different keywords or check your spelling</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="text-gray-400" size={20} />
          <span className="text-gray-400 text-sm">Filter results:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Film className="mr-2" size={16} />
            All ({movies.length + people.length})
          </button>
          
          <button
            onClick={() => setFilter('movies')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'movies'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Film className="mr-2" size={16} />
            Movies ({movies.length})
          </button>
          
          <button
            onClick={() => setFilter('people')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'people'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users className="mr-2" size={16} />
            People ({people.length})
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      </div>

      {/* Movies Section */}
      {filteredMovies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Film className="mr-2" size={24} />
            Movies ({filteredMovies.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => {
              // Only render if it has a title
              if (!movie.title) return null
              
              return (
                <div key={movie.id} className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                  <div className="aspect-[2/3] relative">
                    <img 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg line-clamp-2 leading-tight mb-2">
                      {movie.title}
                    </h3>
                    
                    {/* Genres */}
                    {movie.genre_ids && movie.genre_ids.length > 0 && (
                      <div className="mb-3">
                        <GenreBadges genreIds={movie.genre_ids} maxDisplay={3} showIcon={false} expandable={true} />
                      </div>
                    )}

                    {movie.overview && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {movie.overview}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <a 
                        href={`/movie/${movie.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* People Section */}
      {filteredPeople.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Users className="mr-2" size={24} />
            People ({filteredPeople.length})
          </h2>
          <p className="text-gray-400 mb-4">
            Click on any movie title below to view the movie details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 