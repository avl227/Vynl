import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { query } from './db/postgres.js'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

// Health check
app.get('/up', (_req, res) => res.json({ status: 'up' }))

app.listen(app.get('port'), () => {
  console.log(`Server running on http://localhost:${app.get('port')}`)
})