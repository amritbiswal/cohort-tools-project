const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(
  {origin: ['http://localhost:5173'] // Allow requests from this origin
  //  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  //  credentials: true // Allow cookies to be sent
  }
));

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

app.get("/api/cohorts", (req, res) => {
  // Return list of cohorts
  res.sendFile(path.join(__dirname, "data", "cohorts.json"));
});

app.get("/api/students", (req, res) => {
  // Return list of students
  res.sendFile(path.join(__dirname, "data", "students.json"));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
