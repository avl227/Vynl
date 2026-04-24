import axios from 'axios'

const API_BASE = 'http://localhost:3000'
const INITIAL_ELO = 1500
const K_FACTOR = 64

export function scoreAlbumByRank(position, totalAlbums) {
  if (totalAlbums === 0) return 5
  return Math.max(0, Math.round((1 - position / totalAlbums) * 10))
}

export function eloToDisplayScore(elo, allElos = []) {
  // If no allElos provided, use fixed Elo conversion
  if (!allElos || allElos.length === 0) {
    const baseElo = 1500
    const score = 5 + ((elo - baseElo) / 100) * 2.5
    return Math.max(0, Math.min(10, score))
  }
  
  // Original logic if allElos is provided
  const sortedElos = allElos.sort((a, b) => b - a)
  let position = sortedElos.findIndex(e => e <= elo)
  if (position === -1) position = sortedElos.length
  return scoreAlbumByRank(position, sortedElos.length)
}

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

function updateElo(winnerElo, loserElo, isTie = false) {
  const expectedWinner = expectedScore(winnerElo, loserElo)
  const expectedLoser = 1 - expectedWinner

  let scoreWinner, scoreLoser
  if (isTie) {
    scoreWinner = 0.5
    scoreLoser = 0.5
  } else {
    scoreWinner = 1
    scoreLoser = 0
  }

  const newWinnerElo = winnerElo + K_FACTOR * (scoreWinner - expectedWinner)
  const newLoserElo = loserElo + K_FACTOR * (scoreLoser - expectedLoser)

  return { newWinnerElo, newLoserElo }
}

export async function setRating(userId, albumId, albumMeta, elo = INITIAL_ELO, note = '') {
  try {    
    await axios.post(`${API_BASE}/api/ratings`, {
      userId,
      albumId,
      elo,
      note,
      album: albumMeta  // send the album metadata
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
    return res.data.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0))
  } catch (err) {
    console.error('Failed to fetch ratings:', err)
    return []
  }
}

export async function getAllElos(userId) {
  try {
    const res = await axios.get(`${API_BASE}/api/ratings/${userId}`)
    return res.data.map(r => r.rating)
  } catch (err) {
    console.error('Failed to fetch elos:', err)
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

export function compareAlbums(winnerElo, loserElo, isTie = false) {
  return updateElo(winnerElo, loserElo, isTie)
}