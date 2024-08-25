import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import TestMoviecard from '../components/testMovieCard'; // Corrected component name
import Header from '../components/Header';

function Upcoming() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies((prevMovies) => [...prevMovies, ...data]);
      setTotalPage(data.totalPage);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>SilverScreen Movies | Upcoming movies</title>
      </Helmet>

      <div className="w-full min-h-screen md:p-10 mb-20 md:mb-0">
        <Header />
        <motion.div
          layout
          className="flex flex-wrap relative justify-evenly md:justify-around"
        >
          <AnimatePresence>
            <InfiniteScroll
              className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
              dataLength={movies.length} //This is important field to render the next data
              next={() => setPage(page + 1)}
              hasMore={page < totalPage}
              loader={<span className="loader m-10"></span>}
              scrollThreshold={0.9} // Corrected typo
              style={{ overflow: "hidden" }}
            >
              {movies.map((upc) => (
                <TestMoviecard key={upc._id} movie={upc} />
              ))}
            </InfiniteScroll>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

export default Upcoming;
