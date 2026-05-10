import * as tf from '@tensorflow/tfjs'

/*
  Convert movie overview text into a simple word vector
*/

function textToVector(text, vocabulary) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')

  return vocabulary.map(word =>
    words.includes(word) ? 1 : 0
  )
}

/*
  Build vocabulary from all movie overviews
*/

function buildVocabulary(movies, maxWords = 100) {
  const freq = {}

  movies.forEach(movie => {
    const words = movie.overview
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')

    words.forEach(word => {
      if (word.length < 4) return

      freq[word] = (freq[word] || 0) + 1
    })
  })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxWords)
    .map(entry => entry[0])
}

/*
  Convert movie into numerical vector
*/

export function movieToVector(movie, vocabulary) {
  const textVector = textToVector(
    movie.overview,
    vocabulary
  )

  return [
    movie.rating / 10,
    (movie.year - 1980) / 50,
    ...textVector,
  ]
}

/*
  Build user preference vector
*/

export function buildUserProfile(
  likedMovies,
  vocabulary
) {
  if (likedMovies.length === 0) return null

  const vectors = likedMovies.map(movie =>
    movieToVector(movie, vocabulary)
  )

  const tensor = tf.tensor2d(vectors)

  return tensor.mean(0)
}

/*
  Cosine similarity
*/

export function cosineSimilarity(a, b) {
  return tf.tidy(() => {
    const dot = tf.sum(tf.mul(a, b))

    const normA = tf.norm(a)
    const normB = tf.norm(b)

    return dot.div(normA.mul(normB))
  })
}

/*
  Main recommendation function
*/

export async function recommendMovies(
  likedMovies,
  allMovies,
  topK = 10
) {
  if (likedMovies.length === 0) {
    return allMovies
  }

  const vocabulary = buildVocabulary(allMovies)

  const profile = buildUserProfile(
    likedMovies,
    vocabulary
  )

  const scored = []

  for (const movie of allMovies) {

    // Skip already liked movies
    if (likedMovies.find(m => m.id === movie.id)) {
      continue
    }

    const movieTensor = tf.tensor1d(
      movieToVector(movie, vocabulary)
    )

    const similarity =
      await cosineSimilarity(profile, movieTensor)
        .data()

    scored.push({
      movie,
      score: similarity[0],
    })
  }

  scored.sort((a, b) => b.score - a.score)

  return scored
    .slice(0, topK)
    .map(s => s.movie)
}
