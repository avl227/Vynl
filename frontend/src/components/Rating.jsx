import React, { useState, useEffect } from 'react'
import { eloToDisplayScore, getAllElos } from '../utils/ratings'

export default function Rating({ value }) {
  const [updateTrigger, setUpdateTrigger] = useState(0)

  useEffect(() => {
    const handleRatingsChange = () => {
      setUpdateTrigger(prev => prev + 1)
    }
    window.addEventListener('ratingsChanged', handleRatingsChange)
    return () => window.removeEventListener('ratingsChanged', handleRatingsChange)
  }, [])

  if (value == null) return <span style={{color:'#888'}}>—</span>

  let displayScore
  if (typeof value === 'number') {
    // Assume it's Elo rating, convert to display score
    const allElos = getAllElos()
    displayScore = eloToDisplayScore(value, allElos).toFixed(1)
  } else {
    displayScore = value
  }

  return <strong style={{color:'#0a74da'}}>Score: {displayScore}</strong>
}
