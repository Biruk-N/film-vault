// TMDB Genre IDs and Names
export const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

// Helper function to get genre name by ID
export function getGenreName(genreId: number): string {
  return TMDB_GENRES[genreId] || 'Unknown'
}

// Helper function to get genre names from an array of IDs
export function getGenreNames(genreIds: number[]): string[] {
  return genreIds.map(id => getGenreName(id))
}

// Helper function to get genre names as a comma-separated string
export function getGenreNamesString(genreIds: number[]): string {
  return getGenreNames(genreIds).join(', ')
}

// Get all available genres
export function getAllGenres(): Array<{ id: number; name: string }> {
  return Object.entries(TMDB_GENRES).map(([id, name]) => ({
    id: parseInt(id),
    name
  }))
}

// Helper function to extract genre IDs from different movie data structures
export function extractGenreIds(movie: any): number[] {
  if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
    return movie.genre_ids
  }
  if (movie.genres && Array.isArray(movie.genres)) {
    return movie.genres.map((g: any) => g.id)
  }
  return []
} 