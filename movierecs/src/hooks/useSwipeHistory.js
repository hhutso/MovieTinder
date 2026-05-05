const API_URL = 'http://localhost:5000/api'

export async function saveSwipe(movie, liked) {
  await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      liked,
    }),
  })
}

export async function getSwipeHistory() {
  const res = await fetch(`${API_URL}/swipes`)
  return res.json()
}