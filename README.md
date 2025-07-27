# FilmVault 🎬

A modern movie discovery application built with TanStack Router and powered by TMDB API. Browse trending, popular, and top-rated movies with a beautiful, responsive interface.

## Features

- **Live Movie Data**: Real-time trending and popular movies from TMDB
- **Multiple Categories**: Browse by trending, popular, top-rated, and now playing
- **Advanced Search**: Search across TMDB's extensive movie database
- **Guest Session**: No registration required - browse freely
- **Responsive Design**: Beautiful UI that works on all devices
- **Rich Metadata**: Ratings, release dates, vote counts, and descriptions
- **High-Quality Images**: Professional movie posters from TMDB
- **Secure API**: API key is properly protected using environment variables

## Tech Stack

- **Frontend**: React + TypeScript
- **Router**: TanStack Router
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Movie Data**: TMDB API (Secure implementation)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd film-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up TMDB API Key (Secure Method)**
   
   You'll need a TMDB API key to fetch movie data:
   
   - Visit [TMDB](https://www.themoviedb.org/) and create an account
   - Go to Settings → API → Request API Key
   - Copy your API key
   - Create a `.env` file in the root directory
   - Add: `VITE_TMDB_API_KEY=your-actual-api-key-here`
   - Restart the development server

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application

## Project Structure

```
src/
├── components/          # React components
│   ├── MovieCard.tsx   # Original movie card
│   ├── TMDBMovieCard.tsx # Enhanced TMDB movie card
│   ├── MoviesGrid.tsx  # Movie grid layout
│   └── SearchBar.tsx   # Search functionality
├── hooks/              # Custom React hooks
│   └── useTMDB.ts     # TMDB API hooks
├── lib/               # Utility libraries
│   ├── secure-tmdb-api.ts # Secure TMDB API service
│   └── movies-data.ts # Legacy static data
├── routes/            # TanStack Router routes
│   ├── index.tsx      # Home page
│   ├── movies.tsx     # Movies browse page
│   └── search.tsx     # Search page
└── styles/            # Global styles
    └── app.css        # Tailwind CSS
```

## API Configuration

The application uses TMDB API for all movie data with **secure implementation**:

- ✅ API key is protected using environment variables
- ✅ No exposure in browser developer tools
- ✅ Clear error handling for missing API keys
- ✅ Graceful fallbacks for API errors

See `TMDB_SETUP.md` for detailed setup instructions.

### Rate Limits

- **Read API**: 1,000 requests per day
- **Search API**: 1,000 requests per day

This is sufficient for development and personal use.

## Security Features

FilmVault implements several security best practices:

- **Environment Variables**: API key stored securely in `.env` file
- **No Frontend Exposure**: API key never appears in browser code
- **Error Handling**: Clear messages for configuration issues
- **Input Validation**: Proper sanitization of user inputs
- **CORS Handling**: Secure cross-origin requests

## Guest Session Implementation

FilmVault is designed as a **guest session** application:

- ✅ No user registration required
- ✅ No login/logout functionality  
- ✅ Direct access to TMDB data
- ✅ Perfect for public movie browsing
- ❌ No user-specific features (watchlists, ratings, etc.)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

Create a `.env` file in the root directory:

```bash
# TMDB API Configuration
VITE_TMDB_API_KEY=your-actual-tmdb-api-key-here
```

> **⚠️ Important**: Never commit your `.env` file to version control. The `.env.example` file shows the required format.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie data API
- [TanStack](https://tanstack.com/) for the excellent React libraries
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
