const Car = require("../models/carModel");

exports.addCar = async (req, res) => {
  try {
    const { model, brand, year, price, availability = 1, image = null } = req.body;
    if (!model || !brand || year == null || price == null) {
      return res.status(400).json({ message: "Model, brand, year and price are required" });
    }
    const carId = await Car.addCar({ model, brand, year, price, availability, image });
    res.status(201).json({ message: "Car added successfully!", carId });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getCars = async (req, res) => {
  try {
    res.status(200).json(await Car.getCars());
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.getCarById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const affectedRows = await Car.updateCar(req.params.id, req.body);
    if (!affectedRows) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car updated successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const affectedRows = await Car.deleteCar(req.params.id);
    if (!affectedRows) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};
