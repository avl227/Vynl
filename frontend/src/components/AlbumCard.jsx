import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRating } from '../utils/ratings'
import './AlbumCard.css'

const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    const [updateTrigger, setUpdateTrigger] = useState(0)
    const userId = localStorage.getItem('userId')
    const [existing, setExisting] = useState(null)

    useEffect(() => {
        const handleRatingsChange = () => {
            setUpdateTrigger(prev => prev + 1)
        }
        window.addEventListener('ratingsChanged', handleRatingsChange)
        return () => window.removeEventListener('ratingsChanged', handleRatingsChange)
    }, [])

    useEffect(() => {
        if (userId) {
            getRating(userId, album.id)
                .then(rating => {
                    console.log('Got rating:', rating)
                    setExisting(rating)
                })
                .catch(err => {
                    console.error('Failed to fetch rating:', err)
                    setExisting(null)
                })
        }
    }, [userId, updateTrigger, album.id])

    const handleRateClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/album/${album.id}`, { state: { startRating: true } });
    };

    const handleCardClick = () => {
        navigate(`/album/${album.id}`);
    };

    const hasRating = Boolean(existing)
    const displayScore = existing?.score ? existing.score.toFixed(1) : null

    return (
        <div className="album-card" onClick={handleCardClick}>
            <img src={album.artworkUrl} alt={`${album.title} artwork`} className="album-art" />
            <div className="album-info">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-artist">{album.artist}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="rate-button" onClick={handleRateClick}>
                        {hasRating ? 'Edit Rating' : 'Rate Album'}
                    </button>
                    {hasRating && <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12 }}>{displayScore}</span>}
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;