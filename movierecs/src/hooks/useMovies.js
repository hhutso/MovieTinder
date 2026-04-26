import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY 
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export function useMovies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setMovies(
          data.results
            .filter(m => m.poster_path)
            .map(m => ({
              id: m.id,
              title: m.title,
              poster: `${IMAGE_BASE}${m.poster_path}`,
            }))
        )
      })
  }, [])

  return movies
}