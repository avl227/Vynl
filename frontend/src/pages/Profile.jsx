import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllRatings, removeRating, getDisplayScore } from '../utils/ratings'
import profile from '../data/vynl-profile.png'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [topRatedView, setTopRatedView] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [ratings, setRatings] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleRatingsChange = () => {
      setUpdateTrigger(prev => prev + 1)
    }
    window.addEventListener('ratingsChanged', handleRatingsChange)
    return () => window.removeEventListener('ratingsChanged', handleRatingsChange)
  }, [])

  useEffect(() => {
    if (userId) {
      getAllRatings(userId).then(setRatings)
      // Fetch user data
      fetch(`http://localhost:3000/api/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Failed to fetch user:', err))
    }
  }, [userId, updateTrigger])

  const handleRemove = async (albumId) => {
    await removeRating(userId, albumId)
    window.location.reload()
  }

  const sortedByRating = useMemo(() => {
    return [...ratings].sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [ratings])

  // Recent Activity: sort by most recent (updatedAt descending)
  const sortedByRecent = useMemo(() => {
    return [...ratings].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [ratings])

  const displayedRatings = topRatedView ? sortedByRating : sortedByRecent

  const getScoreDisplay = (rating) => {
    return (rating.score || 0).toFixed(1)
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <img className="profile-photo" src={profile} alt="Profile" />
        <div className="profile-meta">
          <h2>{user?.username || 'Loading...'}</h2>
          <p className="profile-bio">Vinyl collector. Rating everything I spin.</p>
          <div className="profile-stats">
            <div><strong>{ratings.length}</strong><div>Ratings</div></div>
            <div><strong>0</strong><div>Followers</div></div>
            <div><strong>0</strong><div>Following</div></div>
          </div>
        </div>
      </header>

      <div className="profile-actions">
        <button className="rated-albums-button" onClick={() => setTopRatedView(!topRatedView)}>
          {topRatedView ? 'Recent Activity' : `Rated Albums [${ratings.length}]`}
        </button>
      </div>

      <section className="ratings-feed">
        <h3 className="activity-title">{topRatedView ? 'Ranked Albums' : 'Recent Activity'}</h3>
        {ratings.length === 0 && <p className="empty">You haven't rated any albums yet.</p>}

        {displayedRatings.map((r, index) => (
          <article key={r.id} className="rating-item" onClick={() => navigate(`/album/${r.album_id}`)}>
            <img src={r.album.artworkUrl} alt={r.album.title} className="rating-art" />
            <div className="rating-body">
              {topRatedView ? (
                <>
                  <p className="ranked-number">#{index + 1}</p>
                  <p className="rating-title">{r.album.title}</p>
                  <p className="rating-artist">{r.album.artist}</p>
                  <p className="rating-score">Score: {getScoreDisplay(r)}</p>
                </>
              ) : (
                <>
                  <p className="activity-text">You ranked {r.album.title}</p>
                  <p className="activity-date">{new Date(r.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p className="rating-score">Score: {getScoreDisplay(r)}</p>
                  {r.note && <p className="rating-note">{r.note}</p>}
                </>
              )}
            </div>
            <div className="rating-actions">
              <button className="remove-btn" onClick={(e) => { e.stopPropagation(); handleRemove(r.album_id) }}>Remove</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
