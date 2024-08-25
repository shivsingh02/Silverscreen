import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function UpcomingSlider({ movie }) {
  return (
    <div>
      {movie.backdrop_path === null ? (
        <img className="img object-cover" src={noimage} alt="No Image" />
      ) : (
        <LazyLoadImage 
          effect="blur" 
          className="img object-cover" 
          src={"https://image.tmdb.org/t/p/original" + movie.backdrop_path} 
          alt={movie.title} 
        />
      )}
    </div>
  );
}

