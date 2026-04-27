// todo: npm install framer-motion
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMovies } from './hooks/useMovies'

//TENSORFLOW
import { rankMovies } from './utils/recommender'


import './App.css'


function App() {
  //const temp_db = useMovies() 

  //TENSORFLOW TEST CHANGE TO THIS ^^
  const rawMovies = useMovies()    
                     
  const [count, setCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  //TENSORFLOW
  const [likedMovies, setLikedMovies] = useState([])
  const temp_db = rankMovies(rawMovies, likedMovies) 

 
  // Loading guard
  if (temp_db.length === 0) return <p>Loading movies...</p>
 
  /*
  const handleDrag = (event, info) => {
    // right drag
    if (info.offset.x > 100) {
      setCount(count + 1)
      nextMovie()
    }
    // left drag
    else if (info.offset.x < -100) {
      nextMovie()
    }
  }
  */

  //TENSORFLOW TEST CHANGE TO FUNCTION ABOVE ^^
  const handleDrag = (event, info) => {
    if (info.offset.x > 100) {
      // LIKE

      console.log ("User liked:", temp_db[currentIndex])
      setCount(count + 1)
      setLikedMovies(prev => [...prev, temp_db[currentIndex]])
      nextMovie()
    }
    else if (info.offset.x < -100) {
      // PASS
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
 
  const currentMovie = temp_db[currentIndex]
 
  return (
    <>
      <section id="center">
        <div>
          <h1>Movie Tinder</h1>
          <p>Start swiping left and right!</p>
        </div>
 
        {/* swipe feature */}
        <div className="card-container">
          <AnimatePresence>
            <motion.div
              className="motion-div"
              key={temp_db[currentIndex].id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: info => (info > 0 ? 200 : -200), opacity: 0 }}
            >
              <img
                src={temp_db[currentIndex].poster}
                alt="poster"
                draggable="false"
              />
              <h2>{temp_db[currentIndex].title}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
 
        <button className="counter">Like movie count is {count}</button>
      </section>
    </>
  )
}
 
export default App