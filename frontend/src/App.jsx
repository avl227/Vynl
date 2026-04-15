import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Discover from './pages/Discover'
import AlbumDetail from './pages/AlbumDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

export default function App() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <BrowserRouter>
      <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />
      <Routes>
        <Route path="/" element={<Discover searchValue={searchValue} />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
