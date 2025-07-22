import { createFileRoute, Link } from '@tanstack/react-router'
import { Film, Search, Star } from 'lucide-react'
import { getTotalMovieCount } from '~/lib/movies-data'

export const Route = createFileRoute('/')({
  loader: async () => {
    const totalMovies = getTotalMovieCount()
    return { totalMovies }
  },
  component: Home,
})

function Home() {
  const { totalMovies } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🎬</div>
          <h1 className="text-5xl font-bold text-white mb-6">
            FilmVault
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover the greatest films of the 21st century as curated by The New York Times. 
            Explore our collection of {totalMovies} masterpieces that defined modern cinema.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Film className="mr-2" size={20} />
              Browse All Movies
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="mr-2" size={20} />
              Search Movies
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">📽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Curated Collection</h3>
            <p className="text-gray-400">
              Handpicked selection of the most influential films from the 21st century
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Search</h3>
            <p className="text-gray-400">
              Find your favorite movies quickly with our powerful search functionality
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-white mb-2">NYT Selection</h3>
            <p className="text-gray-400">
              Based on The New York Times' definitive list of the greatest films
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-800 rounded-lg">
            <Star className="mr-2 text-yellow-400" size={20} />
            <span className="text-white font-semibold">
              {totalMovies} Masterpieces
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
