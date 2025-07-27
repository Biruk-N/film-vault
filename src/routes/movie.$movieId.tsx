import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMovieDetails, useMovieCredits } from '~/hooks/useTMDB'
import { seo, seoPresets, generateMovieStructuredData } from '~/utils/seo'
import { Star, Calendar, Users, ArrowLeft, ExternalLink, Tag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getPosterUrl, getBackdropUrl } from '~/lib/secure-tmdb-api'
import { CastSection } from '~/components/CastSection'
import { CrewSection } from '~/components/CrewSection'
import { GenreBadges } from '~/components/GenreBadges'
import { extractGenreIds } from '~/lib/genres'

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailsPage,
  loader: async ({ params }) => {
    const movieId = parseInt(params.movieId)
    return { movieId }
  },
  head: ({ loaderData }) => {
    return {
      meta: seo({
        title: 'Movie Details - FilmVault',
        description: 'Get detailed information about this movie including ratings, reviews, and cast.',
        url: `/movie/${loaderData?.movieId}`,
      }),
    }
  },
})

function MovieDetailsPage() {
  const { movieId } = Route.useLoaderData()
  const { data: movie, isLoading, error } = useMovieDetails(movieId)
  const { data: credits, isLoading: creditsLoading } = useMovieCredits(movieId)

  // Update SEO when movie data is available
  React.useEffect(() => {
    if (movie) {
      const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
      const seoData = seoPresets.movieDetails(movie.title, releaseYear.toString())
      
      // Update document title
      document.title = seoData.title
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.description)
      }

      // Add structured data
      const structuredData = generateMovieStructuredData(movie)
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)

      return () => {
        // Clean up structured data script
        const existingScript = document.querySelector('script[type="application/ld+json"]')
        if (existingScript) {
          existingScript.remove()
        }
      }
    }
  }, [movie])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'
  const posterUrl = getPosterUrl(movie.poster_path, 'w500')
  const backdropUrl = getBackdropUrl(movie.backdrop_path || '', 'w1280')
  
  // Check if this is an upcoming movie (release date is in the future)
  const isUpcoming = movie.release_date ? new Date(movie.release_date) > new Date() : false
  
  // Debug: Log movie data to see what we're getting
  console.log('Movie data:', {
    id: movie.id,
    title: movie.title,
    genre_ids: movie.genre_ids,
    genres: movie.genres
  })

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Backdrop Image */}
      {backdropUrl && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              <p className="text-xl md:text-2xl text-gray-300">{releaseYear}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image'
                }}
              />
              
              {/* Rating Badge - Only show for released movies */}
              {!isUpcoming && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold flex items-center">
                    <Star className="mr-2" size={20} fill="currentColor" />
                    {rating}/10
                  </div>
                </div>
              )}
              
              {/* Upcoming Badge - Show for upcoming movies */}
              {isUpcoming && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:w-2/3">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              {/* Movie Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-400">
                  <Calendar className="mr-2" size={16} />
                  {releaseYear}
                </div>
                {!isUpcoming && (
                  <div className="flex items-center text-gray-400">
                    <Star className="mr-2" size={16} />
                    {rating} ({movie.vote_count?.toLocaleString()} votes)
                  </div>
                )}
                <div className="flex items-center text-gray-400">
                  <Users className="mr-2" size={16} />
                  {movie.popularity?.toFixed(0)} popularity
                </div>
              </div>

              {/* Genres */}
              {(() => {
                const genreIds = extractGenreIds(movie)
                return genreIds.length > 0 ? (
                  <div className="mb-6">
                    {/* <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                      <Tag className="mr-2" size={20} />
                      Genres
                    </h2> */}
                    <GenreBadges 
                      genreIds={genreIds} 
                      maxDisplay={6} 
                      expandable={true} 
                    />
                  </div>
                ) : null
              })()}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
                  <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://www.imdb.com/title/tt${movie.id.toString().padStart(7, '0')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <ExternalLink className="mr-2" size={16} />
                  View on IMDb
                </a>
                <Link
                  to="/movies"
                  className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cast Section */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <CastSection cast={credits.cast} maxDisplay={12} />
        )}
        
        {/* Crew Section */}
        {credits && credits.crew && credits.crew.length > 0 && (
          <CrewSection crew={credits.crew} />
        )}
      </div>
    </div>
  )
} 