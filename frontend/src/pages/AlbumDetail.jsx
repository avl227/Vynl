import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { lookupAlbum } from '../api/itunes'
import Rating from '../components/Rating'
import RatingFlow from '../components/RatingFlow'
import { getRating, setRating, getAllRatings } from '../utils/ratings'

export default function AlbumDetail() {
  const { id } = useParams()
  const { data: album, isLoading } = useQuery(['album', id], () => lookupAlbum(id), { enabled: Boolean(id) })
  const [ratingInProgress, setRatingInProgress] = useState(false)

  if (isLoading) return <main style={{padding:20}}>Loading…</main>
  if (!album) return <main style={{padding:20}}>Album not found — <Link to="/">Back</Link></main>

  const existing = getRating(album.id)
  const allRatings = getAllRatings()

  const handleRatingComplete = (score) => {
    setRating(album.id, { id: album.id, title: album.title, artist: album.artist, artworkUrl: album.artworkUrl }, score)
    window.location.reload()
  }

  return (
    <main style={{padding:20}}>
      <Link to="/">← Back</Link>
      <h2>{album.title}</h2>
      <img src={album.artworkUrl} alt={album.title} style={{width:320,borderRadius:6}} />
      <p>Artist: {album.artist}</p>
      <p>Year: {album.year}</p>
      <p><Rating value={existing?.rating} /></p>

      {!existing && !ratingInProgress && (
        <button
          onClick={() => setRatingInProgress(true)}
          style={{marginTop:16,padding:'8px 16px',background:'#0a74da',color:'#fff',border:'none',borderRadius:4,cursor:'pointer'}}
        >
          Rate This Album
        </button>
      )}

      {ratingInProgress && (
        <RatingFlow
          album={album}
          existingRatings={allRatings}
          onComplete={handleRatingComplete}
        />
      )}

      <section style={{marginTop:20}}>
        <h3>Tracks</h3>
        <ol>
          {album.tracks.map(t => (
            <li key={t.id}>{t.trackNumber}. {t.title}</li>
          ))}
        </ol>
      </section>
    </main>
  )
}
