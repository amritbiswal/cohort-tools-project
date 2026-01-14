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
const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";
// CONNECT TO MONGODB - https://mongoosejs.com/docs/connections.html
mongoose
  .connect(MONGODB_URI)
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

// Cohort Routes

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

app.post("/api/cohorts", async (req, res) => {
  // Create a new cohort
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (error) {
    res.status(500).json({ message: "Error creating cohort", error });
  }
});

app.get("/api/cohorts/:id", async (req, res) => {
  // Return a specific cohort by ID
  try {
    const cohort = await Cohort.findById(req.params.id);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cohort", error });
  }
});

app.put("/api/cohorts/:id", async (req, res) => {
  // Update a specific cohort by ID
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }
    res.status(200).json(updatedCohort);
  } catch (error) {
    res.status(500).json({ message: "Error updating cohort", error });
  }
});

app.delete("/api/cohorts/:id", async (req, res) => {
  // Delete a specific cohort by ID
  try {
    const deletedCohort = await Cohort.findByIdAndDelete(req.params.id);
    if (!deletedCohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }
    res.status(200).json({ message: "Cohort deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cohort", error });
  }
});

// Student Routes

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

app.post("/api/students", async (req, res) => {
  // Create a new student
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Error creating student", error });
  }
});

app.get("/api/students/:id", async (req, res) => {
  // Return a specific student by ID
  try {
    const student = await Student.findById(req.params.id).populate("cohort");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving student", error });
  }
});

app.put("/api/students/:id", async (req, res) => {
  // Update a specific student by ID
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("cohort");
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  // Delete a specific student by ID
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
