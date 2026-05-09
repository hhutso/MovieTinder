import { useState, useEffect } from 'react'
import { getSwipeHistory } from '../hooks/useSwipeHistory'

function Profile({ onBack }) {
  const [likedMovies, setLikedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSwipeHistory().then(swipes => {
      setLikedMovies(swipes.filter(s => s.liked))
      setLoading(false)
    })
  }, [])

  return (
    <section id="center">
      <div>
        <h1>Liked Movies</h1>
        <p>Movies you swiped right on</p>
      </div>

      <button onClick={onBack} style={backButtonStyle}>
        ← Back to swiping
      </button>

      {loading && <p>Loading...</p>}

      {!loading && likedMovies.length === 0 && (
        <p>No liked movies yet — start swiping!</p>
      )}

      <div style={gridStyle}>
        {likedMovies.map(movie => (
          <div key={movie._id} style={cardStyle}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={posterStyle}
            />
            <p style={titleStyle}>{movie.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const backButtonStyle = {
  marginBottom: '20px',
  padding: '10px 20px',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: 'rgb(220, 220, 220)',
  cursor: 'pointer',
  fontSize: '14px',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  padding: '16px',
  overflowY: 'auto',
  maxHeight: '60vh',
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
}

const posterStyle = {
  width: '100%',
  borderRadius: '10px',
  objectFit: 'cover',
  aspectRatio: '2/3',
}

const titleStyle = {
  fontSize: '12px',
  textAlign: 'center',
  margin: 0,
}

export default Profile