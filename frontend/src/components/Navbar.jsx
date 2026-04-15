import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import './Navbar.css'

export default function Navbar({ searchValue, onSearchChange }) {
  const navigate = useNavigate()

  const handleSearch = (value) => {
    onSearchChange(value)
    if (value.trim()) {
      navigate('/')
    }
  }

  const handleHomeClick = () => {
    onSearchChange('')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <button onClick={handleHomeClick} className="navbar-brand">Vynl</button>
      <SearchBar value={searchValue} onChange={handleSearch} />
      <div className="navbar-links">
        <Link to="/" onClick={handleHomeClick}>Home</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className="navbar-auth">
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </div>
    </nav>
  )
}
