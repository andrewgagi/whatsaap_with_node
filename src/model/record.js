const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Record = mongoose.model("Record", RecordSchema);

module.exports = { Record };
