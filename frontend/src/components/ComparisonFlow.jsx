import React, { useState, useMemo } from 'react'
import { scoreAlbumByRank } from '../utils/ratings'

export default function ComparisonFlow({ newAlbum, existingAlbums, onComplete, sentiment }) {
  const sorted = useMemo(() => {
    return existingAlbums.sort((a, b) => b.rating - a.rating)
  }, [existingAlbums])

  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(sorted.length)
  const [step, setStep] = useState(0)

  const mid = Math.floor((low + high) / 2)
  const isDone = high - low <= 1
  const comparison = sorted[mid]

  const handlePrefer = (choice) => {
    if (choice === 'new') {
      setHigh(mid)
    } else {
      setLow(mid + 1)
    }
    setStep(step + 1)
  }

  const handleComplete = () => {
    const finalPosition = Math.floor((low + high) / 2)
    const finalScore = scoreAlbumByRank(finalPosition, sorted.length + 1)
    onComplete(finalScore, finalPosition)
  }

  if (isDone) {
    return (
      <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', borderRadius: 6 }}>
        <h3>All set! 👌</h3>
        <p>
          Based on your comparisons, <strong>{newAlbum.title}</strong> ranks #{
            Math.floor((low + high) / 2) + 1
          } in your list with a score of {scoreAlbumByRank(Math.floor((low + high) / 2), sorted.length + 1)}.
        </p>
        <button onClick={handleComplete} style={{ marginTop: 10 }}>
          Save This Rating
        </button>
      </section>
    )
  }

  return (
    <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', borderRadius: 6 }}>
      <h3>Compare Albums (Question {step + 1})</h3>
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
        {/* New Album */}
        <button
          onClick={() => handlePrefer('new')}
          style={{
            padding: 12,
            border: '2px solid transparent',
            background: '#fff',
            borderRadius: 6,
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
            style={{ width: 100, height: 100, borderRadius: 4 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {newAlbum.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {newAlbum.artist}
          </p>
        </button>

        {/* Comparison Album */}
        <button
          onClick={() => handlePrefer('existing')}
          style={{
            padding: 12,
            border: '2px solid transparent',
            background: '#fff',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a74da'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
        >
          <img
            src={comparison.album.artworkUrl}
            alt={comparison.album.title}
            style={{ width: 100, height: 100, borderRadius: 4 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {comparison.album.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {comparison.album.artist}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
            (Your score: {comparison.rating})
          </p>
        </button>
      </div>
    </section>
  )
}
