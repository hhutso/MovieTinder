import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({path: '../movierecs/.env'})

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

const swipeSchema = new mongoose.Schema({
  movieId:  Number,
  title:    String,
  poster:   String,
  liked:    Boolean,
  swipedAt: { type: Date, default: Date.now },
})

const Swipe = mongoose.model('Swipe', swipeSchema)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY 

app.post('/api/swipes', async (req, res) => {
  try {
    const swipe = new Swipe(req.body)
    await swipe.save()
    res.json(swipe)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/swipes', async (req, res) => {
  try {
    const swipes = await Swipe.find().sort({ swipedAt: -1 })
    res.json(swipes)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/movies/discover', async (req, res) => {
  try {
    const { genre, rating, year, runtime } = req.query;
    
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

    if (genre) url += `&with_genres=${genre}`;
    if (rating && rating > 0) url += `&vote_average.gte=${rating}`;
    if (year) url += `&primary_release_year=${year}`;
    if (runtime) url += `&with_runtime.lte=${runtime}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data.results || []);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching movies" });
  }
});

app.get('/api/genres', async (req, res) => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data.genres);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})