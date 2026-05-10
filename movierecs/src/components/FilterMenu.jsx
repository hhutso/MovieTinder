import { useState, useEffect } from 'react';

export default function FilterMenu({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  
  const [localFilters, setLocalFilters] = useState({
    genre: '',
    rating: 0,
    runtime: 240,
    year: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/genres')
      .then(res => res.json())
      .then(setGenres);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-section">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Apply & Hide' : 'Filter Movies'}
      </button>

      {isOpen && (
        <div className="filter-controls">
          <select name="genre" onChange={handleChange}>
            <option value="">All Genres</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <label>Min Rating: {localFilters.rating === 0 ? "Any" : localFilters.rating}</label>
          <input type="range" name="rating" min="0" max="10" step="0.5" value={localFilters.rating} onChange={handleChange} />

          <label>Max Minutes: {localFilters.runtime === 240 ? "Any" : localFilters.runtime}</label>
          <input type="range" name="runtime" min="60" max="240" step="15" value={localFilters.runtime} onChange={handleChange} />
        </div>
      )}
    </div>
  );
}