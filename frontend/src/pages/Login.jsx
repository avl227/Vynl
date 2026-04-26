import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      // Login uses username instead of email
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      })
      localStorage.setItem('userId', res.data.id)
      window.dispatchEvent(new Event('userLoggedIn'))
      nav('/')
    } catch (err) {
      setError('Invalid credentials')
      console.error(err)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Log in</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}