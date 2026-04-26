import axios from 'axios'

const API_BASE = 'http://localhost:3000'

// Rating categories with their score ranges
export const CATEGORIES = {
  liked: { label: 'I liked it', min: 6.7, max: 10.0, initial: 10.0 },
  ok: { label: 'It was ok', min: 3.7, max: 6.6, initial: 6.6 },
  disliked: { label: "I didn't like it", min: 0.0, max: 3.6, initial: 3.6 }
}

// Get category from score
export function getCategoryFromScore(score) {
  if (score >= CATEGORIES.liked.min) return 'liked'
  if (score >= CATEGORIES.ok.min) return 'ok'
  return 'disliked'
}

// Convert rank position to score within a category using linear interpolation
function rankToScore(position, total, category) {
  const { min, max } = CATEGORIES[category]
  if (total <= 1) return max // Top position gets max score
  
  // Linear interpolation: position 0 = max, position total-1 = min
  const normalizedPosition = position / (total - 1)
  return max - normalizedPosition * (max - min)
}

// Get display score from stored rating (0-10 scale)
export function getDisplayScore(rating) {
  return rating?.score ?? 0
}

// Binary search insertion to find correct position in sorted list
function findInsertPosition(newScore, sortedList, category) {
  let low = 0
  let high = sortedList.length
  
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (sortedList[mid].score >= newScore) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  
  return low
}

// Compare two albums using binary search (Beli-style)
// Returns the new scores after comparison
export function compareAlbums(winnerId, winnerScore, loserId, loserScore) {
  const winnerCategory = getCategoryFromScore(winnerScore)
  const loserCategory = getCategoryFromScore(loserScore)
  
  // If different categories, no change needed (already separated)
  if (winnerCategory !== loserCategory) {
    return { [winnerId]: winnerScore, [loserId]: loserScore }
  }
  
  const category = winnerCategory
  const { min, max } = CATEGORIES[category]
  const range = max - min
  
  let newWinnerScore, newLoserScore
  
  if (winnerScore > loserScore) {
    // Winner is already higher - spread them apart significantly
    // New winner gets a boost, loser drops to make room
    const boost = range * 0.15  // 15% of range
    const drop = range * 0.10   // 10% of range
    newWinnerScore = Math.min(max, winnerScore + boost)
    newLoserScore = Math.max(min, loserScore - drop)
  } else if (winnerScore < loserScore) {
    // Winner is lower - move winner above loser with meaningful gap
    // Place winner slightly above loser
    newWinnerScore = Math.min(max, loserScore + range * 0.08)
    newLoserScore = Math.max(min, loserScore)
  } else {
    // Same score - give winner a meaningful boost
    newWinnerScore = Math.min(max, winnerScore + range * 0.10)
    newLoserScore = Math.max(min, loserScore - range * 0.05)
  }
  
  // Ensure winner >= loser
  if (newWinnerScore < newLoserScore) {
    newWinnerScore = newLoserScore
  }
  
  return { [winnerId]: newWinnerScore, [loserId]: newLoserScore }
}

// Handle tie in comparison
export function handleTie(album1Id, album1Score, album2Id, album2Score) {
  const category1 = getCategoryFromScore(album1Score)
  const category2 = getCategoryFromScore(album2Score)
  
  if (category1 !== category2) {
    return { [album1Id]: album1Score, [album2Id]: album2Score }
  }
  
  // Move slightly closer together
  const category = category1
  const { min, max } = CATEGORIES[category]
  const mid = (album1Score + album2Score) / 2
  const adjustment = (max - min) * 0.01 // 1% of range
  
  return {
    [album1Id]: Math.max(min, mid - adjustment),
    [album2Id]: Math.min(max, mid + adjustment)
  }
}

// API functions
export async function setRating(userId, albumId, albumMeta, score, note = '') {
  try {
    const category = getCategoryFromScore(score)
    await axios.post(`${API_BASE}/api/ratings`, {
      userId,
      albumId,
      score,
      note,
      category,
      album: albumMeta
    })
    window.dispatchEvent(new CustomEvent('ratingsChanged'))
  } catch (err) {
    console.error('Failed to save rating:', err)
  }
}

export async function getRating(userId, albumId) {
  try {
    const res = await axios.get(`${API_BASE}/api/ratings/${userId}`)
    return res.data.find(r => r.album_id === albumId) || null
  } catch (err) {
    console.error('Failed to fetch rating:', err)
    return null
  }
}

export async function getAllRatings(userId) {
  try {
    const res = await axios.get(`${API_BASE}/api/ratings/${userId}`)
    return res.data.sort((a, b) => (b.score || 0) - (a.score || 0))
  } catch (err) {
    console.error('Failed to fetch ratings:', err)
    return []
  }
}

export async function getRatingsByCategory(userId, category) {
  try {
    const res = await axios.get(`${API_BASE}/api/ratings/${userId}`)
    return res.data
      .filter(r => r.category === category)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
  } catch (err) {
    console.error('Failed to fetch ratings by category:', err)
    return []
  }
}

export async function removeRating(userId, albumId) {
  try {
    await axios.delete(`${API_BASE}/api/ratings/${userId}/${albumId}`)
    window.dispatchEvent(new CustomEvent('ratingsChanged'))
  } catch (err) {
    console.error('Failed to delete rating:', err)
  }
}

// Legacy function for compatibility
export function scoreAlbumByRank(position, totalAlbums) {
  return rankToScore(position, totalAlbums, 'liked')
}

export function eloToDisplayScore(elo, allElos = []) {
  if (!allElos || allElos.length === 0) return 5
  const sorted = allElos.sort((a, b) => b - a)
  let position = sorted.findIndex(e => e <= elo)
  if (position === -1) position = sorted.length
  return scoreAlbumByRank(position, sorted.length)
}