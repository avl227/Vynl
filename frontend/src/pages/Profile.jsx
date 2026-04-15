import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllRatings, removeRating } from '../utils/ratings'
import './Profile.css'

export default function Profile(){
  const navigate = useNavigate()
  const ratings = getAllRatings()

  const handleRemove = (id) => {
    removeRating(id)
    window.location.reload()
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <img className="profile-photo" src="https://via.placeholder.com/120?text=Photo" alt="Profile" />
        <div className="profile-meta">
          <h2>demo_user</h2>
          <p className="profile-bio">Vinyl collector. Rating everything I spin.</p>
          <div className="profile-stats">
            <div><strong>{ratings.length}</strong><div>Ratings</div></div>
            <div><strong>123</strong><div>Followers</div></div>
            <div><strong>89</strong><div>Following</div></div>
          </div>
        </div>
      </header>

      <section className="ratings-feed">
        {ratings.length === 0 && <p className="empty">You haven't rated any albums yet.</p>}

        {ratings.map(r => (
          <article key={r.id} className="rating-item" onClick={() => navigate(`/album/${r.id}`)}>
            <img src={r.album.artworkUrl} alt={r.album.title} className="rating-art" />
            <div className="rating-body">
              <h4 className="rating-title">{r.album.title}</h4>
              <p className="rating-artist">{r.album.artist}</p>
              <p className="rating-score">My rating: {r.rating}</p>
              {r.note && <p className="rating-note">{r.note}</p>}
            </div>
            <div className="rating-actions">
              <button className="remove-btn" onClick={(e) => { e.stopPropagation(); handleRemove(r.id) }}>Remove</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
