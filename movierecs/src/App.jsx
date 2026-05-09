import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMovies } from './hooks/useMovies'
import { saveSwipe } from './hooks/useSwipeHistory'
import MovieCard from './components/MovieCard'
import Profile from './components/Profile'
import './App.css'

function App() {
  const temp_db = useMovies()
  const [count, setCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showProfile, setShowProfile] = useState(false)

  if (temp_db.length === 0) return <p>Loading movies...</p>

  // Show profile page
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />
  }

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

        <div className="card-container">
          <AnimatePresence>
            <MovieCard
              key={temp_db[currentIndex].id}
              movie={temp_db[currentIndex]}
              onDragEnd={handleDrag}
            />
          </AnimatePresence>
        </div>

        <button className="counter">Like movie count is {count}</button>

        {/* Profile button */}
        <button
          onClick={() => setShowProfile(true)}
          style={{
            marginTop: '16px',
            padding: '10px 24px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: 'rgb(220, 220, 220)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
           View Liked Movies
        </button>
      </section>
    </>
  )
}

export default App