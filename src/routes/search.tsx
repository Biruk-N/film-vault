import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchBar } from '~/components/SearchBar'
import { MoviesGrid } from '~/components/MoviesGrid'
import { useSearchMovies } from '~/hooks/useTMDB'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { seo, seoPresets } from '~/utils/seo'

export const Route = createFileRoute('/search')({
  component: SearchPage,
  head: () => ({
    meta: seo(seoPresets.search),
  }),
})

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: searchResults, isLoading, error } = useSearchMovies(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // For search, we'll show all results since TMDB search returns limited results
  const movies = searchResults || []
  const totalResults = movies.length

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Movies</h1>
          <p className="text-gray-400 text-lg mb-6">
            Search for movies from TMDB's extensive database
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by movie title..."
            className="max-w-md"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Error searching movies: {error.message}</p>
          </div>
        )}
        
        {searchQuery && (
          <div className="mb-4">
            <p className="text-gray-400">
              {isLoading ? 'Searching...' : `Found ${totalResults} movie${totalResults !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-gray-400">Searching movies...</p>
          </div>
        ) : (
          <>
            <MoviesGrid movies={movies} />
            
            {/* Search Results Info */}
            {searchQuery && movies.length > 0 && (
              <div className="mt-8 text-center text-gray-400">
                <p>Showing {movies.length} results for "{searchQuery}"</p>
                <p className="text-sm mt-2">
                  TMDB search returns the most relevant results. Try different keywords for more results.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 