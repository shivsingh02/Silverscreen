import React from "react";

const AutoCompleteBox = ({ data, handleMovieSearch }) => {
  return (
    <div className="autocomplete-box">
      <ul>
        {data.map((movie, index) => (
          <li
            className="cursor-pointer"
            onClick={() => handleMovieSearch(movie.title)} // Call handleMovieSearch with selected movie title
            key={index}
          >
            {movie.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoCompleteBox;

