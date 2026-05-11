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
        const pages = [1, 2, 3, 4, 5];

        const results = await Promise.all(
          pages.map(page =>
            fetch(`http://localhost:5000/api/movies/discover?${query}&page=${page}`)
              .then(res => res.json())
          )
        );

        const allFetchedMovies = results.flat();

        if (Array.isArray(allFetchedMovies)) {
          const processedMovies = allFetchedMovies
            .filter(m => m.poster_path)
            .filter(m => !swipedIds.has(m.id))
            .map(m => ({
              id: m.id,
              title: m.title,
              poster: `${IMAGE_BASE}${m.poster_path}`,
              overview: m.overview,
              rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
              year: m.release_date ? m.release_date.slice(0, 4) : "Unknown",
            }));

          const uniqueMovies = Array.from(new Map(processedMovies.map(m => [m.id, m])).values());

          setMovies(uniqueMovies);
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