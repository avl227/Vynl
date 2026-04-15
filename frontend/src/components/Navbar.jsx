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
      <button onClick={handleHomeClick} className="navbar-panel navbar-logo">
        Vynl
      </button>

      <div className="navbar-panel navbar-search">
        <SearchBar value={searchValue} onChange={handleSearch} />
      </div>

      <Link to="/profile" className="navbar-panel navbar-profile">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="profile-image"
        />
        <span className="profile-username">demo_user</span>
        <span className="profile-chevron" aria-hidden="true">
          ▼
        </span>
      </Link>
    </nav>
  )
}
