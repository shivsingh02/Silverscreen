import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Detail } from './components/Detail';
import Login from './auth/Login';
import Navbar from './components/Navbar'
import Container from './pages/Container'
import Trending from './pages/Trending';
import Upcoming from './pages/Upcoming';
import Favorite from './pages/Favoritepage';
import { MovieProvider } from "./Contextpage";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Player from './pages/Player';
import Search from './pages/Search';
import { Helmet } from "react-helmet";
import logo from "./assets/images/logo.png"
import "./index.css"
import Searchpage from './components/Searchpage';


function App() {
  const location = useLocation();

  // toast
  const notifysuccess = (c) => {
    toast.success(c, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  };
  const notifyerror = (c) => {
    toast.error(c, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  };
  return (
    <MovieProvider>
      <div className="full-page-background">
        <Helmet>
          <meta property="og:image" content={logo} />
        </Helmet>
        <ToastContainer
        />

        {location.pathname !== "/" && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              <Login notifyerror={notifyerror} notifysuccess={notifysuccess} />
            }
          />
          <Route path="/home" element={<Container />} />
          <Route path="/searchpage" element={<Searchpage />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/moviedetail/:id" element={<Detail />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/player/:id/:title" element={<Player />} />{" "}
          {/*Route-1 For Player, Title is just for beauty of url, it is not used anywhere.*/}
          <Route path="/player/:id" element={<Player />} />{" "}
          {/*Route-2 For Player. Movie still available even if someone removes Title from end of the url.*/}
          <Route path="/search/:query" element={<Container />} />
          <Route path="/search/" element={<Container />} />
        </Routes>
      </div>
    </MovieProvider>
  );
}

export default App
