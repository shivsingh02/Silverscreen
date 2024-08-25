import React, { useEffect, useContext, useState } from "react";
import Contextpage from "../Contextpage";
import { Helmet } from "react-helmet";
import "./Genre.css";

function Genre({ foo,foo2 }) {
  const {
    fetchGenre,
    activegenre,
    setActiveGenre,
    genres,
    setMovies,
    page,
    setPage,
    filteredGenre,
  } = useContext(Contextpage);

  const [translateX, setTranslateX] = useState(-600); // Initial translation value
  // const genreRefs = useRef([]);
  const handleGenreClick = async (genre) => {
    // alert(genre.name);
    setActiveGenre(genre.id);
    foo2(genre.name);
    const url = `http://localhost:5000/api/movies-genre?search=${genre.name}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched data:",data)
      foo(data);
      console.log(data);
    } catch (error) {
      console.error("Problem fetching genre specific movie list:", error);
    }
  };

  useEffect(() => {
    fetchGenre(); // Fetching Genres on Initial Render.

    // Add event listener for scroll
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setTranslateX(0); // Reset the translation to 0 when scrolled more than 100 pixels
        window.removeEventListener("scroll", handleScroll); // Remove event listener to prevent unnecessary calculations
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup: Remove event listener when component unmounts
    };
    const nl = document.getElementsByClassName("genre-card-each");
  }, []);

  return (
    <>
      <div className="genre-cards-container flex justify-center p-10">
        <div className="flex items-center genre-cards">
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => handleGenreClick(genre)}
              className={`cursor-pointer genre-card-each  border rounded-lg shadow-sl px-4 py-2 focus:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 font-large text-sm inline-flex items-center ${
                activegenre === genre.id ? "font-bold" : ""
              } z-10`}
              style={{ transform: `translateX(${translateX}px)` }}
            >
              <h1>{genre.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Genre;
