const express = require("express");
const { createRecord, getRecords } = require("../controllers/save");
const recordValidator = require("../middleware/validators/record");
const foodValidator = require("../middleware/validators/food");
const { fetchFoodRecords, createFood } = require("../controllers/food");

const router = express.Router();

router.post("/save", recordValidator, createRecord);
router.get("/foods", fetchFoodRecords);
router.post("/foods", foodValidator, createFood);
router.get("/save", getRecords);

module.exports = router;
