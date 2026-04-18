import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

// Health check
app.get('/up', (_req, res) => res.json({ status: 'up' }))

// Auth endpoints
app.post('/api/auth/signup', (req, res) => {
  // Handle signup: hash password (bcrypt), create user in DB
})

app.post('/api/auth/login', (req, res) => {
  // Handle login: verify credentials, return JWT or session
})

// Rating endpoints
app.post('/api/ratings', (req, res) => {
  // Save rating to DB
})

app.put('/api/ratings/:id', (req, res) => {
  // Update existing rating
})

app.get('/api/ratings/user/:userId', (req, res) => {
  // Fetch user's ratings from DB
})

// User endpoints
app.get('/api/users/:id', (req, res) => {
  // Fetch user profile from DB
})

app.post('/api/users/:id/follow', (req, res) => {
  // Add follow relationship to DB
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