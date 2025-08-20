import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MoviesGrid } from "~/components/MoviesGrid";
import {
  usePopularMovies,
  useTopRatedMovies,
  useNowPlayingMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from "~/hooks/useTMDB";
import {
  TrendingUp,
  Star,
  Play,
  Zap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { seo, seoPresets } from "~/utils/seo";

export const Route = createFileRoute("/movies")({
  component: MoviesPage,
  head: () => ({
    meta: seo(seoPresets.movies),
  }),
});

type MovieCategory =
  | "popular"
  | "trending"
  | "topRated"
  | "nowPlaying"
  | "upcoming";

function MoviesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<MovieCategory>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(20);

  const { data: popularData, isLoading: popularLoading } = usePopularMovies(
    currentPage,
    { enabled: selectedCategory === "popular" }
  );
  const { data: trendingData, isLoading: trendingLoading } = useTrendingMovies(
    "day",
    currentPage,
    { enabled: selectedCategory === "trending" }
  );
  const { data: topRatedData, isLoading: topRatedLoading } = useTopRatedMovies(
    currentPage,
    { enabled: selectedCategory === "topRated" }
  );
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useNowPlayingMovies(currentPage, { enabled: selectedCategory === "nowPlaying" });
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingMovies(
    currentPage,
    { enabled: selectedCategory === "upcoming" }
  );

  const getCurrentData = () => {
    switch (selectedCategory) {
      case "popular":
        return { data: popularData, loading: popularLoading };
      case "trending":
        return { data: trendingData, loading: trendingLoading };
      case "topRated":
        return { data: topRatedData, loading: topRatedLoading };
      case "nowPlaying":
        return { data: nowPlayingData, loading: nowPlayingLoading };
      case "upcoming":
        return { data: upcomingData, loading: upcomingLoading };
      default:
        return { data: popularData, loading: popularLoading };
    }
  };

  const { data, loading } = getCurrentData();
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const totalResults = data?.total_results || 0;

  const handleCategoryChange = (category: MovieCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    {
      id: "popular" as const,
      label: "Popular",
      icon: Zap,
      color: "text-blue-400",
    },
    {
      id: "trending" as const,
      label: "Trending",
      icon: TrendingUp,
      color: "text-orange-400",
    },
    {
      id: "topRated" as const,
      label: "Top Rated",
      icon: Star,
      color: "text-yellow-400",
    },
    {
      id: "nowPlaying" as const,
      label: "Now Playing",
      icon: Play,
      color: "text-green-400",
    },
    {
      id: "upcoming" as const,
      label: "Upcoming",
      icon: Calendar,
      color: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Discover Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Explore the latest and greatest movies from around the world
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`mr-2 ${isActive ? "text-white" : category.color}`}
                    size={18}
                  />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-gray-400">Loading movies...</p>
          </div>
        ) : (
          <MoviesGrid
            movies={movies}
            showRank={
              selectedCategory === "trending" ||
              selectedCategory === "topRated"
                ? true
                : false
            }
            rankOffset={(currentPage - 1) * moviesPerPage}
          />
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <div className="text-gray-400 text-sm">
              Showing {movies.length} movies from{" "}
              {totalResults.toLocaleString()} total results
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Load More Button (Alternative to pagination) */}
        {/* {data && currentPage < totalPages && (
          <div className="mt-6 text-center">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Load More Movies
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
