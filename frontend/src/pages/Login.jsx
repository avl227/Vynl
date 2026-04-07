import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    console.log('login', { email, password })
    nav('/profile')
  }

  return (
    <main style={{padding:20}}>
      <h2>Log in</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,maxWidth:360}}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}
