import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search movies...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const clearSearch = () => {
    setQuery('')
    setDebouncedQuery('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
} 