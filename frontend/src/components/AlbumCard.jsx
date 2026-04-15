import React from 'react';
import './AlbumCard.css';
import { useNavigate } from 'react-router-dom';
import { getRating } from '../utils/ratings'
import Rating from './Rating'

const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    const existing = getRating(String(album.id))

    const handleRateClick = (e) => {
        e.preventDefault();
        navigate(`/album/${album.id}`, { state: { startRating: true } });
    };

    const handleCardClick = () => {
        navigate(`/album/${album.id}`);
    };

    return (
        <div className="album-card" onClick={handleCardClick}>
            <img src={album.artworkUrl} alt={`${album.title} artwork`} className="album-art" />
            <div className="album-info">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-artist">{album.artist}</p>
                <button className="rate-button" onClick={handleRateClick}>
                    Rate Album
                </button>
            </div>
        </div>
    );
};

export default AlbumCard;
