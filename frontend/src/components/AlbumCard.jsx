import React, { useState, useEffect } from 'react';
import './AlbumCard.css';
import { useNavigate } from 'react-router-dom';
import { getRating, eloToDisplayScore, getAllElos } from '../utils/ratings'
import Rating from './Rating'

const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    const [updateTrigger, setUpdateTrigger] = useState(0)

    useEffect(() => {
        const handleRatingsChange = () => {
            setUpdateTrigger(prev => prev + 1)
        }
        window.addEventListener('ratingsChanged', handleRatingsChange)
        return () => window.removeEventListener('ratingsChanged', handleRatingsChange)
    }, [])

    const existing = getRating(String(album.id))
    const allElos = getAllElos()

    const handleRateClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/album/${album.id}`, { state: { startRating: true } });
    };

    const handleCardClick = () => {
        navigate(`/album/${album.id}`);
    };

    const hasRating = Boolean(existing)

    const displayScore = existing ? eloToDisplayScore(existing.elo, allElos).toFixed(1) : null

    return (
        <div className="album-card" onClick={handleCardClick}>
            <img src={album.artworkUrl} alt={`${album.title} artwork`} className="album-art" />
            <div className="album-info">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-artist">{album.artist}</p>
                                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                                    <button className="rate-button" onClick={handleRateClick}>
                                        {hasRating ? 'Edit Rating' : 'Rate Album'}
                                    </button>
                                    {hasRating && <span style={{fontFamily:"DM Mono, monospace",fontSize:12}}>{displayScore}</span>}
                                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
