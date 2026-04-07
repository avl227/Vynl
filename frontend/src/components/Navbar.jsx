import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{display:'flex',gap:12,padding:12,background:'#fff',borderBottom:'1px solid #eee'}}>
      <Link to="/">Vynl</Link>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <div style={{marginLeft:'auto'}}>
        <Link to="/login" style={{marginRight:8}}>Log in</Link>
        <Link to="/signup">Sign up</Link>
      </div>
    </nav>
  )
}
