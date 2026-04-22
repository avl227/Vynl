import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bcrypt from  'bcrypt'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

// Health check
app.get('/up', (_req, res) => res.json({ status: 'up' }))

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  // Handle signup: hash password (bcrypt), create user in DB
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const result = await query(
    `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
    [username, email, hashedPassword]
  )
  res.status(201).json(result.rows[0])
})

app.post('/api/auth/login', async (req, res) => {
  // Handle login: verify credentials, return JWT or session
  const { email, password } = req.body
  const result = await query(
    'SELECT id, username, email, password_hash FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' })
  res.json({ id: user.id, username: user.username, email: user.email })
})

// Rating endpoints
app.post('/api/ratings', async (req, res) => {
  // Save rating to DB
  const { userId, albumId, elo, note } = req.body
  const result = await query(
    'INSERT INTO ratings (user_id, album_id, rating, note) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, album_id) DO UPDATE SET rating = $3, note = $4 RETURNING *',
    [userId, albumId, elo, note]
  )
  res.json(result.rows[0])
})

app.put('/api/ratings/:userId', async (req, res) => {
  // Update existing rating
  const { userId } = req.params
  const result = await query(
    'SELECT r.id, r.album_id, r.rating, r.note, r.updated_at FROM ratings r WHERE r.user_id = $1 ORDER BY r.rating DESC',
    [userId]
  )
  res.json(result.rows)
})

app.delete('/api/ratings/:albumId', async (req, res) => {
  // Delete existing rating
  const { albumId } = req.params
  await query('DELETE FROM ratings WHERE album_id = $1', [albumId])
  res.json({ success: true })
})

// User endpoints
app.get('/api/users/:userId', async (req, res) => {
  // Fetch user profile from DB
  const { userId } = req.params
  const result = await query(
    'SELECT id, username, email FROM users WHERE id = $1',
    [userId]
  )
  res.json(result.rows[0])
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