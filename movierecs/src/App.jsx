import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMovies } from './hooks/useMovies'
import MovieCard from './components/MovieCard'   // ← add this
import './App.css'

function App() {
  const temp_db = useMovies()
  const [count, setCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (temp_db.length === 0) return <p>Loading movies...</p>

  const handleDrag = (event, info) => {
    if (info.offset.x > 100) {
      setCount(count + 1)
      nextMovie()
    } else if (info.offset.x < -100) {
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
      </section>
    </>
  )
}

export default App