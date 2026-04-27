
//OLD FUNCTION...DIDNT WORK AS WELL...
/*
import * as tf from '@tensorflow/tfjs'

// Simple model
export function scoreMovie(movie) {
  // TEMPORARY!!!! fake score based on title length
  return movie.title.length % 10
} */

import * as tf from '@tensorflow/tfjs'

export function rankMovies(movies, likedMovies) {
  if (!likedMovies.length) return movies //if user hasnt liked anything yet ranking will continue as established

  // simple similarity PLACEHOLDER AND TEST FOR TF.JS
  return movies.sort((a, b) => {
    const scoreA = a.title.length
    const scoreB = b.title.length
    return scoreB - scoreA
  })
  //sorts movies by length of movie title where longer titles come first

   /* STEPS
      User likes movies
      likedMovies array grows
      (rankMovies ignores it completely)
      movies sorted by title length
    */
}