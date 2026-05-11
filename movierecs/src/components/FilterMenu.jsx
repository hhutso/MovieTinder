import { useState, useEffect } from 'react';

export default function FilterMenu({ onFilterChange, initialFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  

  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    fetch('http://localhost:5000/api/genres')
      .then(res => res.json())
      .then(setGenres);
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

          {/* The apply button */}
          <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
        </div>
      )}
    </div>
  );
}