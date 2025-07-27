import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchBar } from '~/components/SearchBar'
import { SearchResults } from '~/components/SearchResults'
import { useMultiSearch, useSearchPeople } from '~/hooks/useTMDB'
import { seo, seoPresets } from '~/utils/seo'

export const Route = createFileRoute('/search')({
  component: SearchPage,
  head: () => ({
    meta: seo(seoPresets.search),
  }),
})

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Use multi-search for movies and people
  const { data: multiSearchData, isLoading: multiSearchLoading, error: multiSearchError } = useMultiSearch(searchQuery)
  const { data: peopleData, isLoading: peopleLoading, error: peopleError } = useSearchPeople(searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Extract movies from multi-search results
  const movies = multiSearchData?.results?.filter(item => item.media_type === 'movie') || []
  const people = peopleData || []
  
  const isLoading = multiSearchLoading || peopleLoading
  const error = multiSearchError || peopleError

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Movies & People</h1>
          <p className="text-gray-400 text-lg mb-6">
            Search for movies by title, or find movies by searching for actors, directors, and crew members
          </p>
          
                      <SearchBar 
              onSearch={handleSearch}
              placeholder="Search movies by title or find movies by actor name..."
              className="max-w-md"
            />
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Error searching: {error.message}</p>
          </div>
        )}
        
        <SearchResults 
          movies={movies}
          people={people}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
} 