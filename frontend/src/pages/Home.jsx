import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import AlbumList from '../components/AlbumList'
import albumsData from '../data/mockAlbums'
import { useQuery } from '@tanstack/react-query'
import { searchAlbums } from '../api/itunes'

export default function Home() {
  const [q, setQ] = useState('')

  const { data: results = [], isLoading } = useQuery(['search', q], () => searchAlbums(q), {
    enabled: q.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  })

  const albums = q.trim() ? results : albumsData

  return (
    <main style={{padding:20}}>
      <h2>Discover Albums</h2>
      <SearchBar value={q} onChange={setQ} />
      {isLoading ? <p>Searching...</p> : <AlbumList albums={albums} />}
    </main>
  )
}
