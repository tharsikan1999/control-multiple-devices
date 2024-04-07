const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

// Get all countries
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find().populate("devices");
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to add a device to a country
router.post("/:countryId/devices/:deviceId", async (req, res) => {
  const { countryId, deviceId } = req.params;

  try {
    // Find the country by its ID
    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    // Add the device ID to the devices array of the country
    country.devices.push(deviceId);

    // Save the updated country document
    await country.save();

    res
      .status(200)
      .json({ message: "Device added to country successfully", country });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to create a new country
router.post("/", async (req, res) => {
  try {
    const { name, code } = req.body;

    // Validate the required fields
    if (!name || !code) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new country instance
    const newCountry = new Country({
      name,
      code,
    });

    // Save the new country to the database
    await newCountry.save();

    // Return the newly created country
    res.status(201).json(newCountry);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

/// PUT route to update a country by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, code } = req.body;
    const countryId = req.params.id;

    const country = await Country.findByIdAndUpdate(
      countryId,
      { name, code },
      { new: true }
    );

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE route to delete a country by ID
router.delete("/:id", async (req, res) => {
  try {
    const countryId = req.params.id;

    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    await Country.findByIdAndDelete(countryId);

    res.json({ message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
