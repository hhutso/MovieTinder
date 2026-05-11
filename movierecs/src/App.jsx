import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMovies } from './hooks/useMovies'
import { saveSwipe, getSwipeHistory } from './hooks/useSwipeHistory'
import MovieCard from './components/MovieCard'
import Profile from './components/Profile'
import FilterMenu from './components/FilterMenu'
//TENSORFLOW BELOW
import { recommendMovies } from './utils/recommender'
import './App.css'

function App() {
  //FILTERING LOGIC
  const [filters, setFilters] = useState({ rating: 0, runtime: 240 })
  const [swipedIds, setSwipedIds] = useState(null)
  //MAIN LOGIC — fetch all movies, then filter seen ones locally
  const { movies: allMovies, loading } = useMovies(filters)
  const temp_db = allMovies.filter(m => !swipedIds?.has(m.id))
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
          const likedOnly = data.filter(s => s.liked)
          const allSwipedIds = new Set(data.map(s => s.movieId))
          setCount(likedOnly.length)
          setLikedMovies(likedOnly)
          setSwipedIds(allSwipedIds)
        } else {
          setSwipedIds(new Set())
        }
      })
      .catch(() => setSwipedIds(new Set()))
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [temp_db])

  const activeMovies =
    recommendedMovies.length > 0
      ? recommendedMovies
      : temp_db

  if (swipedIds === null || loading) {
    return (
      <section id="center">
        <FilterMenu onFilterChange={setFilters} initialFilters={filters} />
        <p>Loading movies...</p>
      </section>
    )
  }

  if (temp_db.length === 0) {
    return (
      <section id="center">
        <FilterMenu onFilterChange={setFilters} initialFilters={filters} />
        <p>You've seen all movies, come back later!</p>
      </section>
    )
  }

  // Show profile page
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />
  }

  //UPDATED TENSORFLOW BELOW
  const handleDrag = async (event, info) => {
    if (info.offset.x > 100) {
      await handleLike()
    } else if (info.offset.x < -100) {
      await handleSkip()
    }
  }

  const handleLike = async () => {
    const likedMovie = activeMovies[currentIndex]
    setSwipedIds(prev => new Set(prev).add(likedMovie.id))
    const updatedLikes = [...likedMovies, likedMovie]
    setLikedMovies(updatedLikes)
    setCount(count + 1)
    saveSwipe(likedMovie, true)

    const recs = await recommendMovies(updatedLikes, temp_db)
    setRecommendedMovies(recs)
    nextMovie()
  }

  const handleSkip = async () => {
    const skippedMovie = activeMovies[currentIndex]
    setSwipedIds(prev => new Set(prev).add(skippedMovie.id))
    saveSwipe(skippedMovie, false)
    nextMovie()
  }

  const nextMovie = () => {
    if (currentIndex < activeMovies.length - 1) {
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
          <FilterMenu onFilterChange={setFilters} initialFilters={filters} />
          <p>Start swiping left and right!</p>
        </div>

        <div className='cardAndButtons'>
          <button className='likeButton' onClick={handleSkip}>✖</button>
          <div className="card-container">
            <AnimatePresence mode='wait'>
              <MovieCard
                key={activeMovies[currentIndex]?.id}
                movie={activeMovies[currentIndex] || {}}
                onDragEnd={handleDrag}
              />
            </AnimatePresence>
          </div>
          <button className='likeButton' onClick={handleLike}>❤︎⁠</button>
        </div>

        <button className="counter">Like movie count is {count}</button>

        {/* Profile button */}
        <button className="profile" onClick={() => setShowProfile(true)}>
          View Liked Movies
        </button>
      </section>
    </>
  )
}

export default App