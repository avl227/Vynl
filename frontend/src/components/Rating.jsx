import React, { useState, useEffect } from 'react'
import { eloToDisplayScore, getAllElos } from '../utils/ratings'

export default function Rating({ value, userId }) {
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [allElos, setAllElos] = useState([])

  useEffect(() => {
    const handleRatingsChange = () => {
      setUpdateTrigger(prev => prev + 1)
    }
    window.addEventListener('ratingsChanged', handleRatingsChange)
    return () => window.removeEventListener('ratingsChanged', handleRatingsChange)
  }, [])

  useEffect(() => {
    if (userId) {
      getAllElos(userId).then(elos => setAllElos(elos))
    }
  }, [userId, updateTrigger])

  if (value == null) return <span style={{color:'#888'}}>—</span>
  
  const displayScore = eloToDisplayScore(value, allElos).toFixed(1)

  return <strong style={{color:'#0a74da'}}>Score: {displayScore}</strong>
}