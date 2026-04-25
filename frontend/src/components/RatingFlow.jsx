import React, { useState, useMemo } from 'react'
import ComparisonFlow from './ComparisonFlow'
import { setRating, getAllRatings, CATEGORIES, getCategoryFromScore } from '../utils/ratings'
import './RatingFlow.css'

export default function RatingFlow({ album, existingRatings, onComplete, userId }) {
  const [sentiment, setSentiment] = useState(null)
  const [note, setNote] = useState('')
  const [inComparison, setInComparison] = useState(false)

  const sentimentLabels = {
    liked: { label: 'I liked it', description: `${CATEGORIES.liked.min.toFixed(1)} - ${CATEGORIES.liked.max}` },
    ok: { label: 'It was ok', description: `${CATEGORIES.ok.min.toFixed(1)} - ${CATEGORIES.ok.max}` },
    disliked: { label: "I didn't like it", description: `${CATEGORIES.disliked.min} - ${CATEGORIES.disliked.max.toFixed(1)}` }
  }

  const handleSentimentChoice = (choice) => {
    setSentiment(choice)
  }

  // Get ratings filtered by the selected category
  // Also include ratings without a category (old data) that fall into this category based on score
  const categoryRatings = useMemo(() => {
    if (!sentiment) return []
    return existingRatings.filter(r => {
      // If has category, use it
      if (r.category) return r.category === sentiment
      // Old ratings without category - infer from score
      const score = r.score || 0
      if (sentiment === 'liked') return score >= 6.7
      if (sentiment === 'ok') return score >= 3.7 && score < 6.7
      if (sentiment === 'disliked') return score < 3.7
      return false
    })
  }, [existingRatings, sentiment])

  const handleComparisonComplete = async (finalScore) => {
    await setRating(userId, album.id, album, finalScore, note)
    onComplete(finalScore, note)
  }

  const handleNoteChange = (e) => {
    setNote(e.target.value)
  }

  const handleDone = () => {
    if (!sentiment) return

    // No existing ratings in this category - use initial score
    if (categoryRatings.length === 0) {
      const initialScore = CATEGORIES[sentiment].initial
      handleComparisonComplete(initialScore)
    } else {
      // Has existing ratings - go to comparison flow
      setInComparison(true)
    }
  }

  if (inComparison) {
    return (
      <ComparisonFlow
        newAlbum={album}
        existingAlbums={categoryRatings}
        onComplete={handleComparisonComplete}
        sentiment={sentiment}
        userId={userId}
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
            onClick={handleDone}
            className="submit-button"
          >
            Done
          </button>
        )}
      </div>
    </section>
  )
}