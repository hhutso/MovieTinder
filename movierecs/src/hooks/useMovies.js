import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export function useMovies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {

    // Fetch pages 1-5 simultaneously
    const pages = [1, 2, 3, 4, 5]

    Promise.all(
      pages.map(page =>
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)
          .then(res => res.json())
      )
    ).then(results => {
      // Combine all pages into one array
      const allMovies = results
        .flatMap(data => data.results)
        .filter(m => m.poster_path)
        .map(m => ({
          id: m.id,
          title: m.title,
          poster: `${IMAGE_BASE}${m.poster_path}`,
          overview: m.overview,
          //rating: m.vote_average.toFixed(1),
          rating: m.vote_average.toFixed(1),
          year: m.release_date.slice(0, 4),
        }))

      setMovies(allMovies)
    })

  }, [])

  return movies
}