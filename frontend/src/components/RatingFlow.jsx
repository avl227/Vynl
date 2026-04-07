import React, { useState } from 'react'
import ComparisonFlow from './ComparisonFlow'
import { scoreAlbumByRank } from '../utils/ratings'

export default function RatingFlow({ album, existingRatings, onComplete }) {
  const [sentiment, setSentiment] = useState(null)
  const [inComparison, setInComparison] = useState(false)

  const sentimentLabels = {
    loved: { label: 'I loved it!', icon: '❤️' },
    liked: { label: 'I liked it', icon: '👍' },
    fine: { label: 'It was fine', icon: '😐' },
    disliked: { label: "I didn't like it", icon: '👎' }
  }

  const handleSentimentChoice = (choice) => {
    setSentiment(choice)
    // If no existing albums, skip comparisons and save immediately
    if (existingRatings.length === 0) {
      const sentimentScores = { loved: 9, liked: 7, fine: 5, disliked: 2 }
      onComplete(sentimentScores[choice])
    } else {
      // Move to comparisons
      setInComparison(true)
    }
  }

  const handleComparisonComplete = (finalScore) => {
    onComplete(finalScore)
  }

  if (inComparison) {
    return (
      <ComparisonFlow
        newAlbum={album}
        existingAlbums={existingRatings}
        onComplete={handleComparisonComplete}
        sentiment={sentiment}
      />
    )
  }

  if (sentiment) {
    return null // This shouldn't render if no albums (gets completed immediately)
  }

  return (
    <section style={{ marginTop: 20, padding: 16, background: '#f9f9f9', borderRadius: 6 }}>
      <h3>How did you feel about this album?</h3>
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(sentimentLabels).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleSentimentChoice(key)}
            style={{
              padding: '12px 16px',
              background: '#fff',
              border: '2px solid #ddd',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0a74da'
              e.currentTarget.style.background = '#f0f7ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{val.icon}</span>
            {val.label}
          </button>
        ))}
      </div>
    </section>
  )
}
