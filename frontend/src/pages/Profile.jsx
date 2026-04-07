import React from 'react'
import AlbumList from '../components/AlbumList'
import { getAllRatings, removeRating } from '../utils/ratings'

export default function Profile(){
  const ratings = getAllRatings()

  const handleRemove = (id) => {
    removeRating(id)
    window.location.reload()
  }

  return (
    <main style={{padding:20}}>
      <h2>Your Profile</h2>
      <p>Username: demo_user</p>

      <h3>Your Rated Albums</h3>
      {ratings.length === 0 && <p>You haven't rated any albums yet.</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))',gap:16}}>
        {ratings.map(r => (
          <div key={r.id} style={{border:'1px solid #eee',padding:12,borderRadius:6}}>
            <img src={r.album.artworkUrl} alt={r.album.title} style={{width:'100%',borderRadius:4}} />
            <h4>{r.album.title}</h4>
            <p style={{margin:0}}>by {r.album.artist}</p>
            <p style={{margin:0}}>Your rating: {r.rating}</p>
            <button onClick={() => handleRemove(r.id)} style={{marginTop:8}}>Remove</button>
          </div>
        ))}
      </div>
    </main>
  )
}
