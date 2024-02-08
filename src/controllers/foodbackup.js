const mongoose = require("mongoose");
const FoodModule = require("../model/foods");

const createFood = async (req, res) => {
  try {
    const { fdc_id, data_type, description, publication_date } = req.body;
    const existingRecord = await FoodModule.Food.findOne({ fdc_id });
    if (existingRecord) {
      throw new Error("Fdc_id already exists");
      return;
    }

    // Create a new Record with the provided role
    const newRecord = new FoodModule.Food({
      fdc_id,
      data_type,
      description,
      publication_date,
    });

    await newRecord.save();

    res.status(201).json({ newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const fetchFoodRecords = async (req, res) => {
  try {
    const foodRecord = await FoodModule.Food.find();

    res.status(200).json(foodRecord); // Respond with the food record
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { fetchFoodRecords, createFood };
