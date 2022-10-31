const express = require("express");
const path = require("path");
const fileRoute = require("./routes/file");
const connectDB = require("./db/db");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3030;

//Connect to mongoDB
connectDB();

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(fileRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
