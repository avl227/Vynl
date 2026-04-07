import React from 'react';
import './AlbumCard.css'; // Assuming you will create a CSS file for styling
import { getRating } from '../utils/ratings'
import Rating from './Rating'

const AlbumCard = ({ album }) => {
    const existing = getRating(String(album.id))
    return (
        <div className="album-card">
            <img src={album.artworkUrl} alt={`${album.title} artwork`} className="album-art" />
            <h3 className="album-title">{album.title}</h3>
            <p className="album-artist">{album.artist}</p>
            <p className="album-rating"><Rating value={existing?.rating ?? album.rating} /></p>
        </div>
    );
};

export default AlbumCard;
