import pg from 'pg'

const { Client } = pg

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DBNAME,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false }
})

client.connect()

export const query = async (text, values) => {
  try {
    const res = await client.query(text, values)
    return res
  } catch (err) {
    console.error('Query error:', err)
    throw err
  }
}