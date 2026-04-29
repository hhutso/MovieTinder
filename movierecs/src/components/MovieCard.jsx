import { useState } from 'react'
import { motion } from 'framer-motion'

function MovieCard({ movie, onDragEnd }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        width: 300,
        height: 520,
        position: 'absolute',
        left: 'calc(50% - 150px)',
        perspective: '1000px',
        cursor: 'pointer',
      }}
    >
      <motion.div
        drag={flipped ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={flipped ? null : onDragEnd}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(91, 91, 91, 0.4)',
        }}
      >
        {/* Front — poster + title */}
        <div style={{
          ...faceStyle,
          backgroundColor: 'rgb(100, 100, 100)',
          transform: 'rotateY(0deg)',
        }}>
          <img
            src={movie.poster}
            alt="poster"
            draggable="false"
            style={{
              width: '100%',
              height: '85%',
              objectFit: 'cover',
              borderRadius: '20px 20px 0 0',
              pointerEvents: 'none',
            }}
          />
          <h2 style={{ textAlign: 'center', margin: '8px 0', fontSize: '16px' }}>
            {movie.title}
          </h2>
        </div>

        {/* Back — movie info */}
        <div style={{
          ...faceStyle,
          backgroundColor: 'rgb(100, 100, 100)',
          transform: 'rotateY(180deg)',
          padding: '24px',
          justifyContent: 'flex-start',
          gap: '12px',
          boxSizing: 'border-box',
        }}>
          <img
            src={movie.poster}
            alt="poster"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />
          <h2 style={{ margin: 0, fontSize: '16px' }}>{movie.title}</h2>
          <p style={{ margin: 0, fontSize: '14px' }}>⭐ {movie.rating} &nbsp;·&nbsp; 📅 {movie.year}</p>
          <p style={{ fontSize: '13px', lineHeight: 1.5, overflowY: 'auto', margin: 0 }}>
            {movie.overview}
          </p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: 'auto' }}>
            Click to flip back
          </p>
        </div>
      </motion.div>
    </div>
  )
}

const faceStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',  
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
}

export default MovieCard