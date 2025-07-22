import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchBar } from '~/components/SearchBar'
import { MoviesGrid } from '~/components/MoviesGrid'
import { getAllMovies, searchMovies } from '~/lib/movies-data'

export const Route = createFileRoute('/search')({
  loader: async () => {
    const movies = getAllMovies()
    return { movies }
  },
  component: SearchPage,
})

function SearchPage() {
  const { movies } = Route.useLoaderData()
  const [filteredMovies, setFilteredMovies] = useState(movies)

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredMovies(movies)
    } else {
      const results = searchMovies(query)
      setFilteredMovies(results)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Movies</h1>
          <p className="text-gray-400 text-lg mb-6">
            Find your favorite films from the greatest movies of the 21st century
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by movie title..."
            className="max-w-md"
          />
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400">
            Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <MoviesGrid movies={filteredMovies} />
      </div>
    </div>
  )
} 