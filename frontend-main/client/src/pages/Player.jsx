import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { useParams } from "react-router-dom";

function Player() {
  const [data, setData] = useState({});
  let col = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-gray",
  ];

  const baseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

  const { id } = useParams();
  useEffect(() => {
    fetch(`${baseUrl}/api/movie/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <div className="text-dark min-h-screen h-auto main flex flex-col items-center w-screen pr-5">
      <h1 className="text4x"></h1>
      <section className="flex flex-col lg:flex-row justify-between items-start w-full">
        <div className="w-full lg:w-[60%]flex flex-col justify-center items-center">
          <VideoPlayer sub={true} />
          <h1 className="w-full ml-[5vw]  font-bold mt-3 lg:ml-0 lg:pl-[3vw] pb-5 border-b-2 border-[rgba(255,255,255,0.5)] border-solid lg:border-none">
            {data.title}
          </h1>
        </div>
        <div className="w-full lg:w-[50%] h-full px-[5vw] lg:px-0 lg:pr-2">
          <div className="text-3xl font-extrabold pt-10 px-2">
            {data?.title}
          </div>
          <div className="pt-10 px-2">{data?.fullplot}</div>
          <div className="flex w-full">
            <div className="text-gray-800 pt-3 px-2 w-max">
              IMDb {data?.imdb?.rating}
            </div>
            <div className="text-gray-800 pt-3 px-2">{data?.year}</div>
            <div className="flex">
              {data?.genres?.map((g) => {
                return (
                  <div className=" pt-3 px-2 underline underline-offset-2 cursor-pointer">
                    {g}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-2 items-center">
            <svg
              className="h-[20px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#74C0FC"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </svg>
            Watch with a Prime membership
          </div>
          <br />
          <div className="flex gap-3 flex-wrap">
            {data?.cast?.map((g) => {
              return (
                <div
                  className={`px-2 ${
                    col[Math.floor(Math.random() * col.length)]
                  } rounded-2xl flex justify-center items-center`}
                >
                  {g}
                </div>
              );
            })}
          </div>
          <br />
        </div>
      </section>
    </div>
  );
}

export default Player;
