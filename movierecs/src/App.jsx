import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMovies } from './hooks/useMovies'
import { saveSwipe, getSwipeHistory } from './hooks/useSwipeHistory'
import MovieCard from './components/MovieCard'
import Profile from './components/Profile'
//TENSORFLOW BELOW
import { recommendMovies } from './utils/recommender'
import './App.css'

function App() {
  const allMovies = useMovies()
  const [count, setCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  //TENSORFLOW BELOW
  const [likedMovies, setLikedMovies] = useState([])
  const [recommendedMovies, setRecommendedMovies] = useState([])

  useEffect(() => {
    getSwipeHistory().then(swipes => {
      const ids = new Set(swipes.map(s => s.movieId))
      setSeenIds(ids)
    })
  }, [])

  // Wait for both movies and swipe history to load
  if (allMovies.length === 0 || seenIds === null) return <p>Loading movies...</p>

  const temp_db = allMovies.filter(m => !seenIds.has(m.id))

  if (temp_db.length === 0) return <p>You've seen all movies, come back later!</p>

  // Show profile page
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />
  }
  /* KEEPING PREVIOUS CODE JUST IN CASE
  const handleDrag = (event, info) => {
    if (info.offset.x > 100) {
      setCount(count + 1)
      saveSwipe(temp_db[currentIndex], true)
      setSeenIds(prev => new Set(prev).add(temp_db[currentIndex].id))  // mark as seen immediately
      nextMovie()
    } else if (info.offset.x < -100) {
      saveSwipe(temp_db[currentIndex], false)
      setSeenIds(prev => new Set(prev).add(temp_db[currentIndex].id))  // mark as seen immediately
      nextMovie()
    }
  }
    */

  //UPDATED TENSORFLOW BELOW
  const handleDrag = async (event, info) => {

    if (info.offset.x > 100) {
      await handleLike()

    } else if (info.offset.x < -100) {
      await handleSkip()
    }
  }

  const handleLike = async () => {
    const likedMovie = temp_db[currentIndex]
    const updatedLikes = [...likedMovies, likedMovie]
    setLikedMovies(updatedLikes)
    setCount(count + 1)
    saveSwipe(likedMovie, true)

    const recs = await recommendMovies(updatedLikes, temp_db)
    setRecommendedMovies(recs)
    nextMovie()
  }
  const handleSkip = async () => {
    saveSwipe(temp_db[currentIndex], false)
    nextMovie()
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
          <p>Start swiping left and right!</p>
        </div>

        <div className='cardAndButtons'>

          <button className='likeButton' onClick={handleSkip}>✖</button>
          <div className="card-container">
            <AnimatePresence>
              <MovieCard
                key={temp_db[currentIndex].id}
                movie={temp_db[currentIndex]}
                onDragEnd={handleDrag}
              />
            </AnimatePresence>
          </div>
          <button className='likeButton' onClick={handleLike}>❤︎⁠</button>
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