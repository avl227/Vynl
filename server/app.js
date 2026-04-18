import express from 'express'
import cors from 'cors'
import 'dotenv/config'
// import the frontend routes
import authRoutes from './routes/auth.js'
import albumRoutes from './routes/albums.js'
import userRoutes from './routes/users.js'
import ratingRoutes from './routes/ratings.js'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

// Health check
app.get('/up', (_req, res) => res.json({ status: 'up' }))

// implement routes once db is finished configuring
app.use('/api/auth', authRoutes)           // POST /signup, /login, /logout
app.use('/api/albums', albumRoutes)        // GET /search, GET /:id
app.use('/api/users', userRoutes)          // GET /:id, PUT /:id, GET /:id/following
app.use('/api/ratings', ratingRoutes)      // POST /, PUT /:id, GET /user/:userId

// error handling for routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// error handling for server or error next.js responses
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(app.get('port'), () => {
  console.log(`Server running on http://localhost:${app.get('port')}`)
})

export default app