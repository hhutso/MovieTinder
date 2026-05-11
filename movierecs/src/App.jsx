import { useState , useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMovies } from './hooks/useMovies'
import { saveSwipe } from './hooks/useSwipeHistory'
import MovieCard from './components/MovieCard'
import Profile from './components/Profile'
import FilterMenu from './components/FilterMenu'
//TENSORFLOW BELOW
import { recommendMovies } from './utils/recommender'
import './App.css'

function App() {
  //FILTERING LOGIC
  const [filters, setFilters] = useState({ rating: 0, runtime: 240 });
  const [swipedIds, setSwipedIds] = useState(null);
  //MAIN LOGIC
  const { movies: temp_db, loading } = useMovies(filters, swipedIds || new Set());
  const [count, setCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  //TENSORFLOW BELOW
  const [likedMovies, setLikedMovies] = useState([])
  const [recommendedMovies, setRecommendedMovies] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/swipes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const likedOnly = data.filter(s => s.liked);
          setCount(likedOnly.length); 
          setLikedMovies(likedOnly); 
          setSwipedIds(new Set(data.map(s => s.movieId)));
        } else {
          setSwipedIds(new Set());
        }
      })
      .catch(() => setSwipedIds(new Set()));
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [temp_db]);
  

  if (swipedIds === null || loading) {
    return (
      <section id="center">
        <FilterMenu onFilterChange={setFilters} />
        <p>Loading movies...</p>
      </section>
    );
  }

  if (!temp_db || temp_db.length === 0) {
    return (
      <section id="center">
        <FilterMenu onFilterChange={setFilters} />
        <p>No movies found. Try adjusting your filters.</p>
      </section>
    );
  }

  // Show profile page
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />
  }
  /* KEEPING PREVIOUS CODE JUST IN CASE
  const handleDrag = (event, info) => {
    if (info.offset.x > 100) {
      setCount(count + 1)
      saveSwipe(temp_db[currentIndex], true)   // liked
      nextMovie()
    } else if (info.offset.x < -100) {
      saveSwipe(temp_db[currentIndex], false)  // passed
      nextMovie()
    }
  }
    */

  //UPDATED TENSORFLOW BELOW
  const handleDrag = async (event, info) => {

    if (info.offset.x > 100) {

      setCount(count + 1)

      const likedMovie = temp_db[currentIndex]

      const updatedLikes = [
        ...likedMovies,
        likedMovie
      ]

      setLikedMovies(updatedLikes)

      saveSwipe(likedMovie, true)

      const recs = await recommendMovies(
        updatedLikes,
        temp_db
      )

      setRecommendedMovies(recs)

      nextMovie()

    } else if (info.offset.x < -100) {

      saveSwipe(temp_db[currentIndex], false)

      nextMovie()
    }
  }

  const nextMovie = () => {
    if (currentIndex < temp_db.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      alert('No more recommendations, come back later!')
      setCurrentIndex(0)
    }
  }

  return (
    <>
      <section id="center">
        <div>
          <h1>Movie Tinder</h1>
          <FilterMenu onFilterChange={setFilters} />
          <p>Start swiping left and right!</p>
        </div>

        <div className="card-container">
          <AnimatePresence mode='wait'>
            <MovieCard
              key={temp_db[currentIndex].id}
              movie={temp_db[currentIndex]}
              onDragEnd={handleDrag}
            />
          </AnimatePresence>
        </div>

        <button className="counter">Like movie count is {count}</button>

        {/* Profile button */}
        <button className="profile"
          onClick={() => setShowProfile(true)}
        >
           View Liked Movies
        </button>
      </section>
    </>
  )
}

export default App