const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodSchema = new Schema({
  fdc_id: {
    type: Number,
    required: true,
    unique: true,
  },
  data_type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  publication_date: {
    type: String,
    required: true,
  },
});

const Food = mongoose.model("food", FoodSchema);

// Export the Food model
module.exports = { Food };
