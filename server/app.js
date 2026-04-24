import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import pg from 'pg'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

const { Pool } = pg
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DBNAME,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD
})

const query = (text, params) => pool.query(text, params)

// Health check
app.get('/up', (_req, res) => res.json({ status: 'up' }))

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    // Handle signup: hash password (bcrypt), create user in DB
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashedPassword]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  // Handle login: verify credentials, return JWT or session
  try {
    const { email, password } = req.body
    const result = await query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    )
    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ id: user.id, username: user.username, email: user.email })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Rating endpoints
app.post('/api/ratings', async (req, res) => {
  // Save rating to db
  try {
    const { userId, albumId, elo, note, album } = req.body  // Accept album data
    const albumJson = JSON.stringify(album)  // Store as JSON
    const result = await query(
      'INSERT INTO ratings (user_id, album_id, rating, note, album_data) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, album_id) DO UPDATE SET rating = $3, note = $4, album_data = $5, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [userId, albumId, elo, note, albumJson]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('Rating error:', err.message)
    res.status(500).json({ error: 'Failed to save rating' })
  }
})

app.get('/api/ratings/:userId', async (req, res) => {
  // Fetch all the user ratings
  try {
    const { userId } = req.params
    const result = await query(
      'SELECT id, album_id, rating, note, album_data, updated_at FROM ratings WHERE user_id = $1 ORDER BY rating DESC',
      [userId]
    )
    const ratings = result.rows.map(r => ({
      id: r.id,
      album_id: r.album_id,
      rating: r.rating,
      note: r.note,
      album: r.album_data || {},
      updatedAt: r.updated_at  
    }))
    res.json(ratings)
  } catch (err) {
    console.error('Fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch ratings' })
  }
})

app.delete('/api/ratings/:userId/:albumId', async (req, res) => {
  // Delete an existing rating
  try {
    const { userId, albumId } = req.params
    await query('DELETE FROM ratings WHERE user_id = $1 AND album_id = $2', [userId, albumId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rating' })
  }
})

// User endpoints
app.get('/api/users/:userId', async (req, res) => {
  // Fetch user profile from DB
  try {
    const { userId } = req.params
    const result = await query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Error handling
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(app.get('port'), () => {
  console.log(`Server running on http://localhost:${app.get('port')}`)
})

export default app