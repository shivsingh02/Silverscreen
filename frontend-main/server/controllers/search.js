// const client = require("../utils/db").client;
const fetchData = require("../utils/em");

const { MongoClient, ServerApiVersion } = require("mongodb");
const {ObjectId} = require("mongodb");
const mongo_uri = process.env.MONGO_URI;

const client = new MongoClient(mongo_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

exports.searchFuzzy = async (req, res) => {
  try {
    const searchVal = req.query.search.replace(/%/g, " ");
    console.log("Search value: ", searchVal);
    if (!searchVal) {
      console.log("Search value not provided");
      res.json({ message: "Search value not provided" });
      return;
    }
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("sample_mflix");
    if (!db) {
      console.log("Database not found");
      res.json({ message: "Database not found" });
    }
    const collection = db.collection("movies");
    if (!collection) {
      console.log("Collection not found");
      res.json({ message: "Collection not found" });
    }
    console.log("Collection found, setting up pipeline");
    const search_pipeline = [
      {
        $search: {
          text: {
            query: searchVal,
            path: [
              "plot",
              "genres",
              "cast",
              "title",
              "fullplot",
              "languages",
              "directors",
              "writers",
            ],
            fuzzy: {},
          },
        },
      },
      {
        $limit: 20,
      },
    ];
    const result = await collection.aggregate(search_pipeline).toArray();
    console.log("aggregate created");
    if (!result) {
      console.log("No result found");
      res.json({ message: "No result found" });
    }
    console.log("Result found");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: err, status: "error in connection" });
  } finally {
    await client.close();
  }
};

exports.searchAutocomplete = async (req, res) => {
  try {
    const searchVal = req.query.search.replace(/%/g, " ");
    console.log("Search value: ", searchVal);
    if (!searchVal) {
      console.log("Search value not provided");
      res.json({ message: "Search value not provided" });
    }
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("sample_mflix");
    if (!db) {
      console.log("Database not found");
      res.json({ message: "Database not found" });
    }
    const collection = db.collection("movies");
    if (!collection) {
      console.log("Collection not found");
      res.json({ message: "Collection not found" });
    }
    console.log("Collection found, setting up pipeline");
    const search_pipeline = [
      {
        $search: {
          index: "autoCompleteMovies",
          autocomplete: {
            query: searchVal,
            path: "title",
            tokenOrder: "sequential",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 5,
              maxExpansions: 100,
            },
          },
        },
      },
      {
        $limit: 10,
      },
    ];
    const result = await collection.aggregate(search_pipeline).toArray();
    console.log("aggregate created");
    if (!result) {
      console.log("No result found");
      res.json({ message: "No result found" });
    }
    console.log("Result found");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: err, status: "error in connection" });
  }
};

exports.searchSemantic = async (req, res) => {
  try {
    await client.connect();
    const searchVal = req.query.search.replace(/%/g, " ");
    const database = client.db("sample_mflix");
    const coll = database.collection("embedded_movies");
    const embedding_res = await fetchData(searchVal);
    const embedding = embedding_res;
    console.log(embedding);

    const agg = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "plot_embedding",
          filter: {
            $and: [
              // {
              //   genres: {
              //     $nin: ["Drama", "Western", "Crime"],
              //     $in: ["Action", "Adventure", "Family"],
              //   },
              // },
              {
                year: {
                  $gte: 1960,
                  $lte: 2024,
                },
              },
            ],
          },
          queryVector: embedding,
          numCandidates: 200,
          limit: 20,
        },
      },
      {
        $project: {
          title: 1,
          plot: 1,
          genres: 1,
          runtime: 1,
          metacritic: 1,
          rated: 1,
          cast: 1,
          poster: 1,
          year: 1,
          "imdb.rating": 1,
          "imdb.votes": 1,
        },
      },
    ];

    const result = await coll.aggregate(agg).toArray();
    console.log("aggregate created");
    if (!result) {
      console.log("No result found");
      res.json({ message: "No result found" });
    }
    console.log("Result found");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: err, status: "error in connection" });
  } finally {
    await client.close();
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const moviesCollection = db.collection("movies");
    const movies = await moviesCollection.find().limit(100).toArray();
    res.json(movies);
  } catch (error) {
    console.error("Error retrieving movies", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
};

exports.searchMovie = async (req, res) => {
  try {
    const searchVal = req.query.search.replace(/%/g, " ");
    console.log("Search value: ", searchVal);
    if (!searchVal) {
      console.log("Search value not provided");
      res.json({ message: "Search value not provided" });
      return;
    }
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("sample_mflix");
    if (!db) {
      console.log("Database not found");
      res.json({ message: "Database not found" });
    }
    const collection = db.collection("movies");
    if (!collection) {
      console.log("Collection not found");
      res.json({ message: "Collection not found" });
    }
    console.log("Collection found, setting up pipeline");
    const search_pipeline = [
      {
        $search: {
          text: {
            query: searchVal,
            path: ["title"],
          },
        },
      },
      {
        $limit: 1,
      },
    ];
    const result = await collection.aggregate(search_pipeline).toArray();
    console.log("aggregate created");
    if (!result) {
      console.log("No result found");
      res.json({ message: "No result found" });
    }
    console.log("Result found");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: err, status: "error in connection" });
  } finally {
    await client.close();
  }
};

exports.genreList = async (req, res) => {
  try {
    const searchVal = req.query.search.replace(/%/g, " ");
    console.log("Search value: ", searchVal);
    if (!searchVal) {
      console.log("Search value not provided");
      res.json({ message: "Search value not provided" });
      return;
    }
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("sample_mflix");
    if (!db) {
      console.log("Database not found");
      res.json({ message: "Database not found" });
    }
    const collection = db.collection("movies");
    if (!collection) {
      console.log("Collection not found");
      res.json({ message: "Collection not found" });
    }
    console.log("Collection found, setting up pipeline");
    // const search_pipeline = [
    //   {
    //     $search: {
    //       in: {
    //         path: "genres",
    //         value:searchVal,
    //       },
    //     },
    //   },
    //   {
    //     $limit: 10,
    //   },
    // ];
    const search_pipeline = [
      {
        $search: {
          text: {
            query: searchVal,
            path: ["genres"],
          },
        },
      },
      {
        $limit: 20,
      },
    ];
    const result = await collection.aggregate(search_pipeline).toArray();
    console.log("aggregate created");
    if (!result) {
      console.log("No result found");
      res.json({ message: "No result found" });
    }
    console.log("Result found");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ message: err, status: "error in connection" });
  } finally {
    await client.close();
  }
};

exports.getAMovie = async (req, res) => {
  try {
    await client.connect();
    const query = req.params.id;
    const db = client.db("sample_mflix");
    const moviesCollection = db.collection("movies");
    const objectid = new ObjectId(query);
    const movie = await moviesCollection.findOne({ _id: objectid });
    res.json(movie);
  } catch (error) {
    console.error("Error retrieving movies", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
};
