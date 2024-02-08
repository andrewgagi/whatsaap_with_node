const RecordModule = require("../model/record");

const createRecord = async (req, res) => {
  try {
    const { name, phone_number, time, text } = req.body;
    const existingRecord = await RecordModule.Record.findOne({ phone_number });
    if (existingRecord) {
      return;
    }

    // Create a new Record with the provided role
    const newRecord = new RecordModule.Record({
      name,
      phone_number,
      time,
      text,
    });

    await newRecord.save();

    res.status(201).json({ newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
getRecords = (req, res) => {
  RecordModule.Record.find()
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    });
};
module.exports = { createRecord, getRecords };
