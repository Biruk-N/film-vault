export interface Movie {
  id: number
  title: string
  imdb_url: string
  poster_url: string
}

// Static movie data from our database
export const movies: Movie[] = [
  {
    id: 1,
    title: 'Parasite',
    imdb_url: 'https://www.imdb.com/title/tt6751668/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 2,
    title: 'Mulholland Drive',
    imdb_url: 'https://www.imdb.com/title/tt0166924/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTgzNjY4NjE1OV5BMl5BanBnXkFtZTYwMjYzNjc5._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 3,
    title: 'There Will Be Blood',
    imdb_url: 'https://www.imdb.com/title/tt0469494/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxODQ4MDU5NV5BMl5BanBnXkFtZTcwMDU4MjU1MQ@@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 4,
    title: 'In the Mood for Love',
    imdb_url: 'https://www.imdb.com/title/tt0118694/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYjZjODRlMjQtMjJlYy00ZDBjLTkyYTQtZGQxZTk5NzJhYmNmXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 5,
    title: 'Moonlight',
    imdb_url: 'https://www.imdb.com/title/tt4975722/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyMDA3OTE@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 6,
    title: 'No Country for Old Men',
    imdb_url: 'https://www.imdb.com/title/tt0477348/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 7,
    title: 'Eternal Sunshine of the Spotless Mind',
    imdb_url: 'https://www.imdb.com/title/tt0338013/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 8,
    title: 'Get Out',
    imdb_url: 'https://www.imdb.com/title/tt5052448/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 9,
    title: 'Spirited Away',
    imdb_url: 'https://www.imdb.com/title/tt0245429/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5MDItNjRhYWYwYzE2YmRjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg'
  },
  {
    id: 10,
    title: 'The Social Network',
    imdb_url: 'https://www.imdb.com/title/tt1285016/',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg'
  }
  // Add more movies as needed...
]

// Helper functions
export function getAllMovies(): Movie[] {
  return movies
}

export function getMovieById(id: number): Movie | undefined {
  return movies.find(movie => movie.id === id)
}

export function searchMovies(query: string): Movie[] {
  if (!query.trim()) return movies
  const searchTerm = query.toLowerCase()
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm)
  )
}

export function getTotalMovieCount(): number {
  return movies.length
} 