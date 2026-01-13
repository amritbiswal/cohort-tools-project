const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const path = require("path");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const studentsData = require("./data/students.json");
// const cohortsData = require("./data/cohorts.json");

const Student = require("./models/Student");
const Cohort = require("./models/Cohort");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// CONNECT TO MONGODB - https://mongoosejs.com/docs/connections.html
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow requests from this origin
    //  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    //  credentials: true // Allow cookies to be sent
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

app.get("/api/cohorts", async (req, res) => {
  // Return list of cohorts
  // res.status(200).json(cohortsData);
  // res.sendFile(path.join(__dirname, "data", "cohorts.json"));
  try {
    const cohorts = await Cohort.find();
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cohorts", error });
  }
});

app.get("/api/students", async (req, res) => {
  // Return list of students
  // res.status(200).json(studentsData);
  // res.sendFile(path.join(__dirname, "data", "students.json"));
  try {
    const students = await Student.find().populate("cohort");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving students", error });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
