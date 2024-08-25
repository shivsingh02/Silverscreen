import React, { useEffect, useContext, useState } from "react";
import Contextpage from "../Contextpage";
import Moviecard from "./Moviecard";
import { motion, AnimatePresence } from "framer-motion";
import Genre from "./Genre";
import Header from "./Header";
import UpcomingSlider from "./carousel";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Movies.css";
import { Carousel } from "flowbite-react";
import TestMoviecard from "./testMovieCard";

function Movies() {
  // const {
  //   movies,
  //   loader,
  //   page,
  //   setPage,
  //   totalPage,
  //   setMovies,
  //   activegenre,
  //   filteredGenre,
  // } = useContext(Contextpage);
  const { fetchUpcoming, upcoming } = useContext(Contextpage);

  // const [loadingMore, setLoadingMore] = useState(false);

  // useEffect(() => {
  //   setPage(1);
  // }, []);

  // useEffect(() => {
  //   setMovies([]);
  //   setPage(0);
  // }, [activegenre]);

  // useEffect(() => {
  //   if (page > 0) {
  //     filteredGenre();
  //   }
  // }, [page]);
  useEffect(() => {
    fetchUpcoming();
  }, []);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [genreMovies, setgenreMovies] = useState([]);
  const [genreTitle, setgenreTitle] = useState();

  useEffect(() => {
    fetchMovies();
  }, []);
  const baseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/movies?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies((prevMovies) => [...prevMovies, ...data]);
      setTotalPage(data.totalPage);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // const handleLoadMore = () => {
  //   setLoadingMore(true);
  //   setPage(page + 1);
  //   setLoadingMore(false);
  // };

  return (
    <div>
      <div className="carousel">
        {/* h-75 sm:h-70 xl:h-100 2xl:h-96 */}
        <Carousel slideInterval={5000}>
          {upcoming.slice(0, 10).map((upc) => (
            <UpcomingSlider key={upc.id} movie={upc} />
          ))}
        </Carousel>
      </div>

      <div className="w-full md:p-10 mb-10 md:mb-0">
        <div>
          <Genre foo={setgenreMovies} foo2={setgenreTitle} />
        </div>
        {/* <Header /> */}

        {/* <motion.div
        layout
        className="flex flex-wrap relative justify-evenly md:justify-around"
      >
        <AnimatePresence>
          {loader ? (
            <span className="loader m-10"></span>
          ) : (
            <>
              <div className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                {movies.map((movie) => (
                  <Moviecard key={movie.id} movie={movie} />
                ))}
              </div>
              {loadingMore && <span className="loader m-10"></span>}
              {!loadingMore && page < totalPage && (
                <button
                  className="py-3 px-2 border border-blue-500 rounded-lg"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div> */}
        <motion.div
          layout
          className="flex flex-wrap relative justify-evenly md:justify-around"
        >
          <AnimatePresence>
            <h1 class="text-center text-3xl lg:text-4xl xl:text-5xl">
              {genreTitle}
            </h1>
            <InfiniteScroll
              className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
              dataLength={movies.length} //This is important field to render the next data
              next={() => setPage(page + 1)}
              hasMore={page < totalPage}
              loader={<span className="loader m-10"></span>}
              scrollThreshold={0.9} // Corrected typo
              style={{ overflow: "hidden" }}
            >
              {movies &&
                genreMovies.length == 0 &&
                movies.map((upc) => (
                  <TestMoviecard key={upc._id} movie={upc} />
                ))}
              {genreMovies.length > 0 && (
                <>
                  {genreMovies.map((upc) => (
                    <TestMoviecard key={upc._id} movie={upc} />
                  ))}
                </>
              )}
            </InfiniteScroll>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Movies;
