const express = require("express");
const router = express.Router();
const searchFuncs = require("../controllers/search");

// query value for testing, search: {value}
router.get("/search-fuzzy", searchFuncs.searchFuzzy);
router.get("/search-autocomplete", searchFuncs.searchAutocomplete);
router.get("/search-semantic", searchFuncs.searchSemantic);
router.get("/movies", searchFuncs.getAllMovies);
router.get("/search-movie",searchFuncs.searchMovie);
router.get("/movies-genre",searchFuncs.genreList);
router.get("/movie/:id",searchFuncs.getAMovie);

module.exports = router;
