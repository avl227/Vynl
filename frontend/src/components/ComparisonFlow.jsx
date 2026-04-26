import React, { useState, useMemo } from 'react'
import { compareAlbums, handleTie, CATEGORIES, setRating } from '../utils/ratings'

export default function ComparisonFlow({ newAlbum, existingAlbums, onComplete, sentiment, userId }) {
  const [comparisons, setComparisons] = useState([])
  const [currentComparison, setCurrentComparison] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [newAlbumScore, setNewAlbumScore] = useState(CATEGORIES[sentiment]?.initial || 10.0)

  // Select 3 albums at different score levels for comparison (binary search style)
  const selectedAlbums = useMemo(() => {
    if (existingAlbums.length === 0) return []
    const sorted = [...existingAlbums].sort((a, b) => (b.score || 0) - (a.score || 0))
    const len = sorted.length
    if (len <= 3) return sorted
    // Select top, middle, bottom for binary search
    return [sorted[0], sorted[Math.floor(len / 2)], sorted[len - 1]]
  }, [existingAlbums])

  const handleChoice = async (choice, isTie = false) => {
    const currentAlbum = selectedAlbums[currentComparison]
    if (!currentAlbum) return

    const currentScore = currentAlbum.score || 0
    let updatedScores

    if (isTie) {
      updatedScores = handleTie(newAlbum.id, newAlbumScore, currentAlbum.album_id, currentScore)
    } else if (choice === 'new') {
      // New album wins - it should be >= the other
      updatedScores = compareAlbums(newAlbum.id, newAlbumScore, currentAlbum.album_id, currentScore)
    } else {
      // Existing album wins - it should be >= the new one
      updatedScores = compareAlbums(currentAlbum.album_id, currentScore, newAlbum.id, newAlbumScore)
    }

    // Update new album score
    if (updatedScores[newAlbum.id] !== undefined) {
      setNewAlbumScore(updatedScores[newAlbum.id])
    }

    // Also update the existing album's score in the database
    if (updatedScores[currentAlbum.album_id] !== undefined) {
      const existingAlbum = currentAlbum.album || {}
      await setRating(userId, currentAlbum.album_id, existingAlbum, updatedScores[currentAlbum.album_id], currentAlbum.note)
    }

    const newComparisons = [...comparisons, { choice, isTie, opponent: currentAlbum }]
    setComparisons(newComparisons)

    if (currentComparison < selectedAlbums.length - 1) {
      setCurrentComparison(currentComparison + 1)
    } else {
      setIsComplete(true)
      // Final score is already set in newAlbumScore
      onComplete(newAlbumScore)
    }
  }

  if (existingAlbums.length === 0) {
    // No existing albums in this category, use initial score
    onComplete(CATEGORIES[sentiment]?.initial || 10.0)
    return null
  }

  if (isComplete) {
    return (
      <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', border: '1px solid #000' }}>
        <h3>All set! 👌</h3>
        <p>
          Based on your comparisons, <strong>{newAlbum.title}</strong> has been rated <strong>{newAlbumScore.toFixed(1)}</strong>.
        </p>
        <button onClick={() => onComplete(newAlbumScore)} style={{ marginTop: 10, background: '#ff8c42', border: '1px solid #000', padding: '8px 16px' }}>
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
            src={newAlbum.artworkUrl || newAlbum.album?.artworkUrl}
            alt={newAlbum.title || newAlbum.album?.title}
            style={{ width: 100, height: 100 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {newAlbum.title || newAlbum.album?.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {newAlbum.artist || newAlbum.album?.artist}
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
            src={currentAlbum.album?.artworkUrl}
            alt={currentAlbum.album?.title}
            style={{ width: 100, height: 100 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {currentAlbum.album?.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {currentAlbum.album?.artist}
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