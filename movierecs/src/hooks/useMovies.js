import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const TMDB_BASE = 'https://api.themoviedb.org/3'

export function useMovies(filters) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const pages = [1, 2, 3, 4, 5]

        // Build TMDB discover URL with filters applied directly
        const buildUrl = (page) => {
          let url = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`
          if (filters.genre)                url += `&with_genres=${filters.genre}`
          if (filters.rating && filters.rating > 0) url += `&vote_average.gte=${filters.rating}`
          if (filters.runtime && filters.runtime < 240) url += `&with_runtime.lte=${filters.runtime}`
          return url
        }

        const results = await Promise.all(
          pages.map(page =>
            fetch(buildUrl(page))
              .then(res => res.json())
              .then(data => data.results || [])
          )
        )

        const allFetchedMovies = results.flat()

        const processedMovies = allFetchedMovies
          .filter(m => m.poster_path)
          .map(m => ({
            id: m.id,
            title: m.title,
            poster: `${IMAGE_BASE}${m.poster_path}`,
            overview: m.overview,
            rating: m.vote_average ? m.vote_average.toFixed(1) : 'N/A',
            year: m.release_date ? m.release_date.slice(0, 4) : 'Unknown',
          }))

        const uniqueMovies = Array.from(new Map(processedMovies.map(m => [m.id, m])).values())
        setMovies(uniqueMovies)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [filters])

  return { movies, loading }
}