import React, { useState, useMemo } from 'react'
import { compareAlbums, setRating, getAllRatings } from '../utils/ratings'

export default function ComparisonFlow({ newAlbum, existingAlbums, onComplete, sentiment, userId }) {
  const [comparisons, setComparisons] = useState([])
  const [currentComparison, setCurrentComparison] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const selectedAlbums = useMemo(() => {
    if (existingAlbums.length === 0) return []
    const sorted = [...existingAlbums].sort((a, b) => b.rating - a.rating)
    const len = sorted.length
    if (len <= 3) return sorted
    return [sorted[0], sorted[Math.floor(len / 2)], sorted[len - 1]]
  }, [existingAlbums])

  const handleChoice = async (choice, isTie = false) => {
    const currentAlbum = selectedAlbums[currentComparison]
    if (!currentAlbum) return

    let newAlbumElo = newAlbum.currentElo || 1500

    if (choice === 'new') {
      const { newWinnerElo } = compareAlbums(newAlbumElo, currentAlbum.rating, isTie)
      newAlbum.currentElo = newWinnerElo
    } else if (choice === 'existing') {
      const { newLoserElo } = compareAlbums(newAlbumElo, currentAlbum.rating, isTie)
      newAlbum.currentElo = newLoserElo
    }

    const newComparisons = [...comparisons, { choice, isTie, opponent: currentAlbum }]
    setComparisons(newComparisons)

    if (currentComparison < selectedAlbums.length - 1) {
      setCurrentComparison(currentComparison + 1)
    } else {
      setIsComplete(true)
      onComplete(newAlbum.currentElo || 1500)
    }
  }

  if (existingAlbums.length === 0) {
    onComplete(1500)
    return null
  }

  if (isComplete) {
    return (
      <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', border: '1px solid #000' }}>
        <h3>All set! 👌</h3>
        <p>
          Based on your comparisons, <strong>{newAlbum.title}</strong> has been rated.
        </p>
        <button onClick={() => onComplete()} style={{ marginTop: 10, background: '#ff8c42', border: '1px solid #000', padding: '8px 16px' }}>
          Done
        </button>
      </section>
    )
  }

  const currentAlbum = selectedAlbums[currentComparison]

  return (
    <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', border: '1px solid #000' }}>
      <h3>Compare Albums (Question {currentComparison + 1} of {selectedAlbums.length})</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Which do you prefer?
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 16,
        }}
      >
        <button
          onClick={() => handleChoice('new')}
          style={{
            padding: 12,
            border: '2px solid transparent',
            background: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a74da'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
        >
          <img
            src={newAlbum.artworkUrl}
            alt={newAlbum.title}
            style={{ width: 100, height: 100 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {newAlbum.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {newAlbum.artist}
          </p>
        </button>

        <button
          onClick={() => handleChoice('existing')}
          style={{
            padding: 12,
            border: '2px solid transparent',
            background: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a74da'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
        >
          <img
            src={currentAlbum.album.artworkUrl}
            alt={currentAlbum.album.title}
            style={{ width: 100, height: 100 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {currentAlbum.album.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {currentAlbum.album.artist}
          </p>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button
          onClick={() => handleChoice(null, true)}
          style={{
            background: '#fff1cd',
            border: '1px solid #000',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          They're tied
        </button>
      </div>
    </section>
  )
}