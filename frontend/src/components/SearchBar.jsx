import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <input
      aria-label="search"
      placeholder="Search albums..."
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{padding:8, width:'100%', maxWidth:480, marginBottom:12}}
    />
  )
}
