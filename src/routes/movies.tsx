import { createFileRoute } from '@tanstack/react-router'
import { MoviesGrid } from '~/components/MoviesGrid'
import { getAllMovies } from '~/lib/movies-data'

export const Route = createFileRoute('/movies')({
  loader: async () => {
    const movies = getAllMovies()
    return { movies }
  },
  component: MoviesPage,
})

function MoviesPage() {
  const { movies } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Greatest Films of the 21st Century</h1>
          <p className="text-gray-400 text-lg">
            Discover the top 100 movies as selected by The New York Times
          </p>
        </div>
        
        <MoviesGrid movies={movies} showRank={true} />
      </div>
    </div>
  )
} 