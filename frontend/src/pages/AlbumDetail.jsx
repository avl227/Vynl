import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { lookupAlbum } from '../api/itunes'
import Rating from '../components/Rating'
import RatingFlow from '../components/RatingFlow'
import { getRating, setRating, getAllRatings } from '../utils/ratings'
import './AlbumDetail.css'

export default function AlbumDetail() {
  const { id } = useParams()
  const location = useLocation()
  const { data: album, isLoading } = useQuery(['album', id], () => lookupAlbum(id), { enabled: Boolean(id) })
  const [ratingInProgress, setRatingInProgress] = useState(false)
  const [ratings, setRatings] = useState(null)

  useEffect(() => {
    if (location.state?.startRating) {
      setRatingInProgress(true)
    }
  }, [location.state])

  if (isLoading) return <main className="album-detail"><div className="loading">Loading…</div></main>
  if (!album) return <main className="album-detail"><Link to="/" className="back-link">← Back</Link><p>Album not found</p></main>

  const existing = getRating(album.id)
  const allRatings = getAllRatings()
  const existingRatings = allRatings.filter(r => r.id !== String(album.id))

  const handleRatingComplete = (elo, note) => {
    setRating(album.id, { id: album.id, title: album.title, artist: album.artist, artworkUrl: album.artworkUrl }, elo, note)
    setRatingInProgress(false)
    setRatings({ myRating: elo, note })
  }

  const displayRating = ratings?.myRating ?? existing?.elo
  const displayNote = ratings?.note ?? existing?.note

  return (
    <main className="album-detail">
      <Link to="/" className="back-link">← Back</Link>
      
      {ratingInProgress && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <button className="modal-close" onClick={() => setRatingInProgress(false)}>×</button>
            <RatingFlow
              album={album}
              existingRatings={allRatings}
              onComplete={handleRatingComplete}
            />
          </div>
        </div>
      )}

      <div className="album-container">
        <div className="album-art-section">
          <img src={album.artworkUrl} alt={album.title} className="album-art-large" />
        </div>

        <div className="album-info-section">
          <h1 className="album-title">{album.title}</h1>
          <p className="album-artist">{album.artist}</p>
          {album.year && <p className="album-year">{album.year}</p>}

          <div className="ratings-section">
            <div className="rating-item">
              <p className="rating-label">My Rating</p>
              <Rating value={displayRating} />
              {displayNote && <p className="rating-note">{displayNote}</p>}
            </div>
            <div className="rating-item">
              <p className="rating-label">Friend Rating</p>
              <p className="friend-rating">— (Coming soon)</p>
            </div>
          </div>

          {!ratingInProgress && (
            <button
              onClick={() => setRatingInProgress(true)}
              className="rate-album-button"
            >
              {displayRating ? 'Edit Rating' : 'Rate Album'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
