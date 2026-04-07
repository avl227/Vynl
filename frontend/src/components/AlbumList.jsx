import React from 'react'
import AlbumCard from './AlbumCard'
import { Link } from 'react-router-dom'

export default function AlbumList({ albums }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))',gap:16}}>
      {albums.map(a => (
        <Link to={`/album/${a.id}`} key={a.id} style={{textDecoration:'none', color:'inherit'}}>
          <AlbumCard album={a} />
        </Link>
      ))}
    </div>
  )
}
