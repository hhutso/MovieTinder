import { useMovies } from "./hooks/useMovies";

export default function MovieCard() {
  const movies = useMovies();
  const [index, setIndex] = useState(0);

  if (!movies.length) return <p>Loading...</p>;

  const movie = movies[index];

  return (
    <div className="card">
      <img src={movie.poster} alt={movie.title} />
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <div className="actions">
        <button onClick={() => setIndex(i => i + 1)}> Pass</button>
        <button onClick={() => setIndex(i => i + 1)}> Like</button>
      </div>
    </div>
  );
}