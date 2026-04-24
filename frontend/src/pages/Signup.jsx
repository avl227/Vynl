import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', {
        username,
        email,
        password
      })
      localStorage.setItem('userId', res.data.id)
      nav('/profile')
    } catch (err) {
      setError('Signup failed')
      console.error(err)
    }
  }

  return (
    <main style={{padding:20}}>
      <h2>Sign up</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,maxWidth:360}}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
    </main>
  )
}