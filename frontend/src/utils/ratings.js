const KEY = 'vynl_ratings'

export function scoreAlbumByRank(position, totalAlbums) {
  // Convert position (0-indexed) to 0-10 score
  // position 0 (best) = 10, position totalAlbums-1 (worst) = 0
  if (totalAlbums === 0) return 5
  return Math.max(0, Math.round((1 - position / totalAlbums) * 10))
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
}

export function setRating(id, albumMeta, rating, note = '') {
  const store = readStore()
  store[id] = { album: albumMeta, rating, note, updatedAt: Date.now() }
  writeStore(store)
}

export function getRating(id) {
  const store = readStore()
  return store[id] || null
}

export function getAllRatings() {
  const store = readStore()
  return Object.entries(store).map(([id, value]) => ({ id, ...value }))
}

export function removeRating(id) {
  const store = readStore()
  delete store[id]
  writeStore(store)
}
