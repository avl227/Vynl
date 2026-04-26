import React, { useState, useMemo, useEffect } from 'react'
import { CATEGORIES, setRating } from '../utils/ratings'

export default function ComparisonFlow({ newAlbum, existingAlbums, onComplete, sentiment, userId }) {
  const [phase, setPhase] = useState('init') // init, vsTop, vsBottom, binary, complete
  const [searchWindow, setSearchWindow] = useState({ low: 0, high: 0 })
  const [newAlbumScore, setNewAlbumScore] = useState(CATEGORIES[sentiment]?.initial || 10.0)

  // Sort albums by score for binary search
  const sortedAlbums = useMemo(() => {
    return [...existingAlbums].sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [existingAlbums])

  const { min: floor, max: ceiling } = CATEGORIES[sentiment] || { min: 0, max: 10 }

  // Redistribute scores across all albums in the tier
  const redistributeScores = (albums) => {
    const total = albums.length
    if (total === 0) return {}

    const step = (ceiling - floor) / (total - 1)
    const scores = {}

    albums.forEach((album, i) => {
      const id = album.album_id || album.id
      scores[id] = ceiling - (i * step)
    })

    return scores
  }

  // Helper to insert at a specific position and save all scores
  const insertAt = async (insertIndex) => {
    const allAlbums = [
      ...sortedAlbums.slice(0, insertIndex).map(a => ({ ...a, isNew: false })),
      { album_id: newAlbum.id, album: newAlbum, isNew: true },
      ...sortedAlbums.slice(insertIndex).map(a => ({ ...a, isNew: false }))
    ]
    const scores = redistributeScores(allAlbums)

    for (const album of allAlbums) {
      const id = album.isNew ? newAlbum.id : album.album_id
      const score = scores[id]
      const albumData = album.isNew ? newAlbum : album.album
      await setRating(userId, id, albumData, score, album.note || '')
    }

    setNewAlbumScore(scores[newAlbum.id])
    setPhase('complete')
  }

  // Start the algorithm
  useEffect(() => {
    if (existingAlbums.length === 0) {
      // Case 1: No existing albums
      onComplete(ceiling)
      return
    }

    if (existingAlbums.length === 1) {
      // Case 2: One existing album - compare against it
      setPhase('vsBottom')
      return
    }

    // Case 3: Two+ albums - start with boundary comparison vs #1
    setPhase('vsTop')
  }, [])

  const handleChoice = async (choice) => {
    if (phase === 'vsTop') {
      if (choice === 'new') {
        // New album beats #1 - becomes new #1
        await insertAt(0)
      } else {
        // Lost to #1
        if (sortedAlbums.length === 1) {
          // Only one album, slot below it
          await insertAt(1)
        } else {
          setPhase('vsBottom')
        }
      }
    } else if (phase === 'vsBottom') {
      if (choice === 'existing') {
        // New album loses to last place - becomes new last
        await insertAt(sortedAlbums.length)
      } else {
        // Beat last place
        if (sortedAlbums.length === 2) {
          // Only two albums, slot between them
          await insertAt(1)
        } else {
          // Exclude boundary albums already compared
          setSearchWindow({ low: 1, high: sortedAlbums.length - 2 })
          setPhase('binary')
        }
      }
    } else if (phase === 'binary') {
      const { low, high } = searchWindow
      const mid = Math.floor((low + high) / 2)

      if (choice === 'new') {
        // New album belongs above midpoint (lower indices)
        const newHigh = mid - 1
        if (newHigh < low) {
          // Window narrowed - insert at mid
          await insertAt(mid)
        } else {
          setSearchWindow({ low, high: newHigh })
        }
      } else {
        // New album belongs below midpoint (higher indices)
        const newLow = mid + 1
        if (newLow > high) {
          // Window narrowed - insert below mid
          await insertAt(mid + 1)
        } else {
          setSearchWindow({ low: newLow, high })
        }
      }
    }
  }

  const handleTie = async () => {
    // Tie - share score with current album
    if (phase === 'vsTop') {
      // Tie with #1 - insert at position 0 (share ceiling)
      await insertAt(0)
    } else if (phase === 'vsBottom') {
      // Tie with last place - insert alongside last (not after)
      await insertAt(sortedAlbums.length - 1)
    } else if (phase === 'binary') {
      // Tie with midpoint - insert at mid
      const { low, high } = searchWindow
      const mid = Math.floor((low + high) / 2)
      await insertAt(mid)
    }
  }

  // Get current album to compare against
  const getCurrentAlbum = () => {
    if (phase === 'vsTop') return sortedAlbums[0]
    if (phase === 'vsBottom') return sortedAlbums[sortedAlbums.length - 1]
    if (phase === 'binary') {
      const { low, high } = searchWindow
      const mid = Math.floor((low + high) / 2)
      return sortedAlbums[mid]
    }
    return null
  }

  const currentAlbum = getCurrentAlbum()

  // Completion screen
  if (phase === 'complete') {
    return (
      <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', border: '1px solid #000' }}>
        <h3>All set! 👌</h3>
        <p>
          <strong>{newAlbum.title}</strong> has been rated <strong>{newAlbumScore.toFixed(1)}</strong>.
        </p>
        <button onClick={() => onComplete(newAlbumScore)} style={{ marginTop: 10, background: '#ff8c42', border: '1px solid #000', padding: '8px 16px' }}>
          Done
        </button>
      </section>
    )
  }

  // No albums case
  if (existingAlbums.length === 0) {
    return null
  }

  // Get phase description
  // const getPhaseDescription = () => {
  //   if (phase === 'vsTop') return `Comparing against your highest-rated album in this tier (${ceiling.toFixed(1)})`
  //   if (phase === 'vsBottom') return `Comparing against your lowest-rated album in this tier (${floor.toFixed(1)})`
  //   if (phase === 'binary') return 'Finding the right position...'
  //   return ''
  // }

  return (
    <section style={{ marginTop: 20, padding: 12, background: '#f9f9f9', border: '1px solid #000' }}>
      <h3>Which do you prefer?</h3>
      {/* <p style={{ fontSize: '0.9rem', color: '#666' }}>
        {getPhaseDescription()}
      </p> */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
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
            src={currentAlbum?.album?.artworkUrl}
            alt={currentAlbum?.album?.title}
            style={{ width: 100, height: 100 }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {currentAlbum?.album?.title}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>
            {currentAlbum?.album?.artist}
          </p>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button
          onClick={handleTie}
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