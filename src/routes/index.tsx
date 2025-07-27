import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Film, Search, Star, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTrendingMovies, usePopularMovies } from '~/hooks/useTMDB'
import { MoviesGrid } from '~/components/MoviesGrid'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [trendingPage, setTrendingPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)
  
  const { data: trendingData, isLoading: trendingLoading } = useTrendingMovies('day', trendingPage)
  const { data: popularData, isLoading: popularLoading } = usePopularMovies(popularPage)

  const trendingMovies = trendingData?.results || []
  const popularMovies = popularData?.results || []

  const handleTrendingPageChange = (newPage: number) => {
    setTrendingPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePopularPageChange = (newPage: number) => {
    setPopularPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            Discover the latest trending and most popular movies from around the world. 
            Stay updated with what's hot in cinema right now.
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

        {/* Trending Movies Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="text-orange-400 mr-3" size={24} />
              <h2 className="text-3xl font-bold text-white">Trending Today</h2>
            </div>
            
            {/* Trending Pagination */}
            {trendingData && trendingData.total_pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTrendingPageChange(trendingPage - 1)}
                  disabled={trendingPage === 1}
                  className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-gray-400 text-sm">
                  {trendingPage} / {trendingData.total_pages}
                </span>
                <button
                  onClick={() => handleTrendingPageChange(trendingPage + 1)}
                  disabled={trendingPage === trendingData.total_pages}
                  className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          
          {trendingLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg h-80 mb-2"></div>
                  <div className="bg-gray-800 rounded h-4 mb-1"></div>
                  <div className="bg-gray-800 rounded h-3 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <MoviesGrid movies={trendingMovies} showRank={false} />
          )}
        </div>

        {/* Popular Movies Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Zap className="text-blue-400 mr-3" size={24} />
              <h2 className="text-3xl font-bold text-white">Most Popular</h2>
            </div>
            
            {/* Popular Pagination */}
            {popularData && popularData.total_pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePopularPageChange(popularPage - 1)}
                  disabled={popularPage === 1}
                  className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-gray-400 text-sm">
                  {popularPage} / {popularData.total_pages}
                </span>
                <button
                  onClick={() => handlePopularPageChange(popularPage + 1)}
                  disabled={popularPage === popularData.total_pages}
                  className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          
          {popularLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg h-80 mb-2"></div>
                  <div className="bg-gray-800 rounded h-4 mb-1"></div>
                  <div className="bg-gray-800 rounded h-3 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <MoviesGrid movies={popularMovies} showRank={false} />
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">📽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Data</h3>
            <p className="text-gray-400">
              Real-time trending and popular movies from TMDB
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
            <h3 className="text-xl font-semibold text-white mb-2">Guest Access</h3>
            <p className="text-gray-400">
              No account required - browse and discover movies instantly
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-800 rounded-lg">
            <Star className="mr-2 text-yellow-400" size={20} />
            <span className="text-white font-semibold">
              Live from TMDB
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
