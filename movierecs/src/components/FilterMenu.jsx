import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export default function FilterMenu({ onFilterChange, initialFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [localFilters, setLocalFilters] = useState(initialFilters);

  //Fetch genres directly from TMDB instead of the server
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => setGenres(data.genres || []))
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  return (
    <div className="filter-section">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Menu' : 'Filter Movies'}
      </button>

      {isOpen && (
        <div className="filters-dropdown">
          <select name="genre" value={localFilters.genre} onChange={handleChange}>
            <option value="">All Genres</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <label>Min Rating: {localFilters.rating}</label>
          <input type="range" name="rating" min="0" max="10" step="0.5"
                 value={localFilters.rating} onChange={handleChange} />

          <label>Max Runtime: {localFilters.runtime}m</label>
          <input type="range" name="runtime" min="60" max="240" step="15"
                 value={localFilters.runtime} onChange={handleChange} />

          <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
        </div>
      )}
    </div>
  );
}