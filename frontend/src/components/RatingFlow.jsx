import React, { useState } from 'react'
import ComparisonFlow from './ComparisonFlow'
import { setRating } from '../utils/ratings'
import './RatingFlow.css'

export default function RatingFlow({ album, existingRatings, onComplete, userId }) {
  const [sentiment, setSentiment] = useState(null)
  const [note, setNote] = useState('')
  const [inComparison, setInComparison] = useState(false)

  const sentimentLabels = {
    liked: { label: 'I liked it', description: 'It was a good album' },
    fine: { label: 'It was ok', description: 'It had some good moments' },
    disliked: { label: "I didn't like it", description: 'Not really my thing' }
  }

  const handleSentimentChoice = (choice) => {
    setSentiment(choice)
  }

  const handleComparisonComplete = async (finalElo) => {
    await setRating(userId, album.id, album, finalElo, note)
    onComplete(finalElo, note)
  }

  const handleNoteChange = (e) => {
    setNote(e.target.value)
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

  return (
    <section className="rating-flow">
      <h2>Rate "{album.title}"</h2>
      
      <div className="sentiment-section">
        <h3>How did you feel about this album?</h3>
        <div className="sentiment-buttons">
          {Object.entries(sentimentLabels).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleSentimentChoice(key)}
              className={`sentiment-button ${key} ${sentiment === key ? 'active' : ''}`}
            >
              <div className="sentiment-label">{val.label}</div>
              <div className="sentiment-description">{val.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="note-section">
        <label htmlFor="rating-note" className="note-label">Add a note (optional)</label>
        <textarea
          id="rating-note"
          className="note-textarea"
          placeholder="What did you think about this album? Favorite tracks? Any thoughts..."
          value={note}
          onChange={handleNoteChange}
          rows={4}
        />
      </div>

      <div className="button-group">
        {sentiment && (
          <button
            onClick={() => {
              if (existingRatings.length === 0) {
                const sentimentElos = { liked: 1600, fine: 1500, disliked: 1400 }
                handleComparisonComplete(sentimentElos[sentiment])
              } else {
                setInComparison(true)
              }
            }}
            className="submit-button"
          >
            Done
          </button>
        )}
      </div>
    </section>
  )
}