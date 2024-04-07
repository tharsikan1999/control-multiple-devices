const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const countryRoutes = require("./routes/countryRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/location_db", {})
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

app.use("/countries", countryRoutes);
app.use("/devices", deviceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
