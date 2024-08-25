import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import noimage from '../assets/images/no-image.jpg';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast } from 'react-toastify';


function TestMoviecard({ movie }) {
    
    const [isBookmarked, setIsBookmarked] = useState(null);

    useEffect(() => {
        if (localStorage.getItem(movie.id)) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }
    }, [movie.id]);

    const BookmarkMovie = () => {
        if (!user) {
            toast.info("To bookmark this movie, please log in.");
        } else {
            setIsBookmarked(!isBookmarked);
            if (isBookmarked) {
                localStorage.removeItem(movie.id);
            } else {
                localStorage.setItem(movie.id, JSON.stringify(movie));
            }
        }
    }

    if (!movie.poster || movie.alt === 'not found') {
        return null; // If poster is not available or alt is 'not found', don't render the movie card
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            layout
            className="card relative w-full md:w-60 h-[410px] md:h-[360px] my-3 mx-4 md:my-5 md:mx-0 cursor-pointer rounded-xl overflow-hidden">

            {/* bookmark buttons */}
            <button className="absolute bg-black text-white p-2 z-20 right-0 m-3 rounded-full text-xl" onClick={BookmarkMovie}>
                {isBookmarked ? <AiFillStar /> : <AiOutlineStar />}
            </button>

            <div className='absolute bottom-0 w-full flex justify-between items-end p-3 z-20'>
                <h1 className='text-white text-xl font-semibold  break-normal break-words'>{movie.title || movie.name}</h1>
            </div>

            <Link to={`/player/${movie._id}`} className='h-full w-full  absolute z-10'></Link>

            <div>
                <LazyLoadImage effect='blur' className='img object-cover' src={movie.poster} />
            </div>
        </motion.div>
    );
}

export default TestMoviecard;
