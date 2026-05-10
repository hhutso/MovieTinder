import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY 
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export function useMovies(filters, swipedIds) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`http://localhost:5000/api/movies/discover?${query}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const processedMovies = data
            .filter(m => m.poster_path)
            .filter(m => !swipedIds.has(m.id))
            .map(m => ({
              id: m.id,
              title: m.title,
              poster: `${IMAGE_BASE}${m.poster_path}`,
              overview: m.overview,
              rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
              year: m.release_date ? m.release_date.slice(0,4) : "Unknown",
            }));

          setMovies(processedMovies);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, swipedIds]);

  return { movies, loading };
}

// export function useMovies() {
//   const [movies, setMovies] = useState([])

//   useEffect(() => {
//     fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
//       .then(res => res.json())
//       .then(data => {
//         setMovies(
//           data.results
//             .filter(m => m.poster_path)
//             .map(m => ({
//               id: m.id,
//               title: m.title,
//               poster: `${IMAGE_BASE}${m.poster_path}`,
//               overview: m.overview,
//               rating: m.vote_average.toFixed(1),
//               year: m.release_date.slice(0,4),
//             }))
//         )
//       })
//   }, [])

//   return movies
// }