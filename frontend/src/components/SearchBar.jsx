import React from 'react'
import './SearchBar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <input
      aria-label="search"
      placeholder="Search albums..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="search-bar"
    />
  )
}
