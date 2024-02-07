const express = require("express");
const createRecord = require("../controllers/save");
const recordValidator = require("../middleware/validators/record");

const router = express.Router();

router.post("/save", recordValidator, createRecord);

module.exports = router;
