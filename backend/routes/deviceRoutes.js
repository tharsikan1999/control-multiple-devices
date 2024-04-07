const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const Country = require("../models/Country");

// Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to create a new device
router.post("/", async (req, res) => {
  try {
    const { serialNumber, type, image, status } = req.body;

    // Validate the required fields
    if (!serialNumber || !type || !image || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new device instance
    const newDevice = new Device({
      serialNumber,
      type,
      image,
      status,
    });

    // Save the new device to the database
    await newDevice.save();

    // Return the newly created device
    res.status(201).json({ newDevice });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

// PUT route to update a device by ID
router.put("/:id", async (req, res) => {
  try {
    const deviceId = req.params.id;
    const { serialNumber, type, image, status } = req.body;

    // Check if the device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Update the device fields
    device.serialNumber = serialNumber;
    device.type = type;
    device.image = image;
    device.status = status;

    // Save the updated device to the database
    const updatedDevice = await device.save();

    // Return the updated device
    res.json(updatedDevice);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

// DELETE route to delete a device by ID
router.delete("/:id", async (req, res) => {
  try {
    const deviceId = req.params.id;

    // Check if the device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Remove the device from all locations that reference it
    await Country.updateMany(
      { devices: deviceId },
      { $pull: { devices: deviceId } }
    );

    // Delete the device from the database
    await Device.deleteOne({ _id: deviceId });

    // Return success message
    res.json({ message: "Device deleted successfully" });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
