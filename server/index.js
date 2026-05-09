import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})