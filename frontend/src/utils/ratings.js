const KEY = 'vynl_ratings'
const INITIAL_ELO = 1500
const K_FACTOR = 64

export function scoreAlbumByRank(position, totalAlbums) {
  // Convert position (0-indexed) to 0-10 score
  // position 0 (best) = 10, position totalAlbums-1 (worst) = 0
  if (totalAlbums === 0) return 5
  return Math.max(0, Math.round((1 - position / totalAlbums) * 10))
}

// Convert Elo rating to 0-10 display score
export function eloToDisplayScore(elo, allElos) {
  if (allElos.length === 0) return 5
  const sortedElos = allElos.sort((a, b) => b - a)
  let position = sortedElos.findIndex(e => e <= elo)
  if (position === -1) position = sortedElos.length
  return scoreAlbumByRank(position, sortedElos.length)
}

// Elo calculation functions
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

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

function writeStore(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj))
  // Dispatch custom event to notify components of changes
  window.dispatchEvent(new CustomEvent('ratingsChanged'))
}

export function setRating(id, albumMeta, elo = INITIAL_ELO, note = '') {
  const store = readStore()
  store[id] = { album: albumMeta, elo, note, updatedAt: Date.now() }
  writeStore(store)
}

export function getRating(id) {
  const store = readStore()
  const item = store[id]
  if (!item) return null
  // Migrate old format to new format
  if (item.rating && !item.elo) {
    // Map old scores to Elo
    const eloMap = { 10: 1600, 7: 1550, 5: 1500, 2: 1400 }
    item.elo = eloMap[item.rating] || INITIAL_ELO
    writeStore(store)
  }
  return item
}

export function getAllRatings() {
  const store = readStore()
  // Migrate any old format ratings
  let needsUpdate = false
  Object.values(store).forEach(item => {
    if (item.rating && !item.elo) {
      item.elo = item.rating
      needsUpdate = true
    }
  })
  if (needsUpdate) writeStore(store)
  
  return Object.entries(store)
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

export function updateRatingElo(id, newElo) {
  const store = readStore()
  if (store[id]) {
    store[id].elo = newElo
    store[id].updatedAt = Date.now()
    writeStore(store)
  }
}

export function getAllElos() {
  const store = readStore()
  return Object.values(store).map(item => item.elo || item.rating || INITIAL_ELO)
}

export function compareAlbums(winnerId, loserId, isTie = false) {
  const store = readStore()
  const winner = store[winnerId]
  const loser = store[loserId]

  if (!winner || !loser) return

  const { newWinnerElo, newLoserElo } = updateElo(winner.elo, loser.elo, isTie)

  winner.elo = newWinnerElo
  loser.elo = newLoserElo
  winner.updatedAt = Date.now()
  loser.updatedAt = Date.now()

  writeStore(store)
}

export function removeRating(id) {
  const store = readStore()
  delete store[id]
  writeStore(store)
}
