import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Contextpage from "../Contextpage";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import User from "../assets/images/User.jpg";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import Searchbar from "./Searchbar";
import "./Navbar.css";
import AutoCompleteBox from "./AutoCompleteBox";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";
import TestMoviecard from "./testMovieCard";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { header, user } = useContext(Contextpage);
  const [activemobile, setActivemobile] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [search, setSearch] = useState("");
  const [searchView, setSearchView] = useState("");
  const [data, setData] = useState([]);
  const [dataAuto, setDataAuto] = useState([]);
  const [flag, setFlag] = useState(false);
  const [flagAuto, setFlagAuto] = useState(true);
  const [flagSearch, setFlagSearch] = useState(false);
  const [nullmessage, setNullmessage] = useState("");
  const [searchmsg, setSearchmsg] = useState("");
  const [movieName, setMovieName] = useState("");
  const [moviePlot, setMoviePlot] = useState("");
  const [moviePoster, setMoviePoster] = useState("");
  const autoCompleteRef = useRef(null);

  const baseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 10) {
        setIsSticky(true);
        navbar.classList.add("sticky2");
      } else {
        setIsSticky(false);
        navbar.classList.remove("sticky2");
      }
    };

    const handleClickOutside = (event) => {
      if (
        autoCompleteRef.current &&
        !autoCompleteRef.current.contains(event.target) &&
        !event.target.classList.contains("search-input")
      ) {
        setFlagAuto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Navdata = [
    {
      id: 1,
      headername: "Movies",
      Name: "Movies",
      link: "/home",
    },
    // {
    //   id: 2,
    //   headername: "Trending",
    //   Name: "Trending",
    //   link: "/trending",
    // },
    {
      id: 3,
      headername: "Upcoming",
      Name: "Upcoming",
      link: "/upcoming",
    },
    {
      id: 4,
      headername: "Favorites",
      Name: "Favorites",
      link: "/favorite",
    },
  ];

  const handleClick = () => {
    setIsClicked(true);
  };

  async function handleMovieSearch(title) {
    setFlagAuto(false);
    setFlag(false);
    setFlagSearch(true);
    setNullmessage("");
    console.log("Search value: ", title);
    fetch(`${baseUrl}/api/search-movie?search=${title}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFlagSearch(true);
          console.log(data);
        }
        setMovieName(data[0].title);
        console.log(movieName);
        setMoviePlot(data[0].plot);
        console.log(moviePlot);
        setMoviePoster(data[0].poster);
      });

      setSearchView(title);
  
  // Set the search state to the selected movie title
  setSearch(title.replace(" ", "%"));
  
  // Call the search function to fetch data based on the selected movie title
  await handleSearch({ target: { value: title } });
  }

  async function handleSearch(e) {
    if (!search) {
      setNullmessage("Search value not provided");
      setFlag(false);
      return;
    }
    setNullmessage("loading...");
    setSearchmsg(`Search results for ${search}`);
    setFlagAuto(false);
    setFlag(false);
    e.preventDefault();
    console.log("Search value: ", search);
    await fetch(`${baseUrl}/api/search-fuzzy?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/searchpage");
        setData(data);
        if (data) {
          setFlag(true);
          setMovies(data);
          setTotalPage(data.totalPage);
        }
        // setData("");
      });

    await fetch(`${baseUrl}/api/search-semantic?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
        if (data) {
          setFlag(true);
          setMovies2(data);
          setTotalPage(data.totalPage);
        }
        setData("");
        console.log(movies2);
      });
  }

  useEffect(() => {
    async function handleSearchAuto() {
      console.log("Search value: ", search);
      if (search === "") {
        setFlagAuto(false);
        return;
      }
      await fetch(`${baseUrl}/api/search-autocomplete?search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDataAuto(data);
          if (dataAuto) {
            setFlagAuto(true);
          } else {
            setFlagAuto(false);
          }
        });
    }
    handleSearchAuto();
  }, [search]);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const [movies, setMovies] = useState([]);
  const [movies2, setMovies2] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  return (
    <>
      <div
        className={`navbar ${
          isSticky ? "sticky2" : ""
        } sticky w-full z-30 top-0 start-0 border-b border-gray-200`}
      >
        <div className="navbar-container flex flex-wrap items-center justify-between mx-auto p-3">
          <a
            href="/home"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://t4.ftcdn.net/jpg/05/00/61/19/360_F_500611919_5wuf1qGRCubiXXxIa7og1fLLCyHi6qP9.webp"
              className="h-8 rounded-full"
              alt="Logo"
            />
            <span className="self-center text-2xl text-black font-semibold whitespace-nowrap">
              SilverScreen
            </span>
          </a>
          <div className="logout-btn flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse text-black">
            <button
              type="button"
              className="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              <a href="/">Logout</a>
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <div className="navbar-notch">
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                {Navdata.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="block py-2 px-3 text-blue-700 rounded md:text-gray-900 md:hover:text-blue-700 md:p-0"
                      aria-current="page"
                    >
                      <p>{item.headername}</p>
                    </Link>
                  </li>
                ))}
                <li>
                  <div className="relative">
                    <div className="search-icon absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      type="text"
                      id="search-navbar"
                      className="search-input block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 focus:placeholder-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-300 ease-in-out"
                      placeholder="Search..."
                      onClick={() => setFlagAuto(true)}
                      onChange={(event) => {
                        setSearchView(event.target.value);
                        setSearch(event.target.value.replace(" ", "%"));
                      }}
                      onKeyDown={handleEnterPress}
                      value={searchView}
                    />
                    {flagAuto ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-[limegreen] max-w-max px-2"
                      >
                        {/* <h2 className="font-bold mb-2 pt-2 bg-[orangered] w-full">
                          This is autocomplete suggestions box
                        </h2>
                        <ul>
                          {dataAuto.map((movie, index) => (
                            <li
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMovieSearch(movie.title);
                              }}
                              key={index}
                            >
                              {movie.title}
                            </li>
                          ))}
                        </ul> */}
                      </div>
                    ) : null}
                    {/* {flag ? (
                      // <div className="bg-[cyan] absolute -z-10 top-[100px]">
                      //   <h2 className="font-bold mb-2 pt-2 bg-[#8f39c9] w-full">
                      //     {searchmsg}
                      //   </h2>
                      //   <ul>
                      //     {data.map((movie, index) => (
                      //       <li
                      //         className="cursor-pointer"
                      //         onClick={(e) => {
                      //           e.preventDefault();
                      //           handleMovieSearch(movie.title);
                      //         }}
                      //         key={index}
                      //       >
                      //         {movie.title}
                      //       </li>
                      //     ))}
                      //   </ul>
                      // </div>
                      // <></>
                      <AnimatePresence>
                        <InfiniteScroll
                          className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
                          dataLength={movies.length} //This is important field to render the next data
                          // next={() => setPage(page + 1)}
                          // hasMore={page < totalPage}
                          loader={<span className="loader m-10"></span>}
                          scrollThreshold={0.9} // Corrected typo
                          // style={{ overflow: "scroll" }}
                        >
                          {movies.map((upc) => (
                            <TestMoviecard key={upc._id} movie={upc} />
                            // <TestMoviecard key={index} movie={"upc"} />
                          ))}
                        </InfiniteScroll>
                      </AnimatePresence>
                    ) : (
                      <div>
                        <p>{nullmessage}</p>
                      </div>
                    )} */}
                    {/* {flagSearch ? (
                      <div className="max-w-[200px] bg-[pink] p-2">
                        <section>
                          <h1 className="my-2 bg-purple-500">{movieName}</h1>
                          <p className="my-2">{moviePlot}</p>
                          <a
                            className="bg-[blue] text-white px-2 py-1 cursor-pointer"
                            href={moviePoster}
                          >
                            Link to poster
                          </a>
                        </section>
                      </div>
                    ) : null} */}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {flagAuto && (
        <div className="AutoCompleteWrapper" ref={autoCompleteRef}>
          <AutoCompleteBox
            data={dataAuto}
            handleMovieSearch={handleMovieSearch}
          />
        </div>
      )}

      {flag && location.pathname === "/searchpage" ? (
        // <div className="bg-[cyan] absolute -z-10 top-[100px]">
        //   <h2 className="font-bold mb-2 pt-2 bg-[#8f39c9] w-full">
        //     {searchmsg}
        //   </h2>
        //   <ul>
        //     {data.map((movie, index) => (
        //       <li
        //         className="cursor-pointer"
        //         onClick={(e) => {
        //           e.preventDefault();
        //           handleMovieSearch(movie.title);
        //         }}
        //         key={index}
        //       >
        //         {movie.title}
        //       </li>
        //     ))}
        //   </ul>
        // </div>
        // <></>
        <AnimatePresence>
          <h1 class="text-center text-3xl lg:text-4xl xl:text-5xl">
            FilmFinder Fuzz
          </h1>
          <InfiniteScroll
            className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
            dataLength={movies.length} //This is important field to render the next data
            // next={() => setPage(page + 1)}
            // hasMore={page < totalPage}
            loader={<span className="loader m-10"></span>}
            scrollThreshold={0.9} // Corrected typo
            // style={{ overflow: "scroll" }}
          >
            {movies.map((upc) => (
              <TestMoviecard key={upc._id} movie={upc} />
              // <TestMoviecard key={index} movie={"upc"} />
            ))}
          </InfiniteScroll>
          <h1 class="text-center text-3xl lg:text-4xl xl:text-5xl">
            FilmFinder Advanced
          </h1>
          <InfiniteScroll
            className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
            dataLength={movies2.length} //This is important field to render the next data
            // next={() => setPage(page + 1)}
            // hasMore={page < totalPage}
            loader={<span className="loader m-10"></span>}
            scrollThreshold={0.9} // Corrected typo
            // style={{ overflow: "scroll" }}
          >
            {movies2.map((upc) => (
              <TestMoviecard key={upc._id} movie={upc} />
              // <TestMoviecard key={index} movie={"upc"} />
            ))}
          </InfiniteScroll>
        </AnimatePresence>
      ) : (
        <div>{/* <p>{nullmessage}</p> */}</div>
      )}
    </>
  );
}

export default Navbar;
