const mongoose = require("mongoose");
const FoodModule = require("../model/foods");
const { matchedData } = require("express-validator");

const PAGINATION = 10; // Ensure this is properly defined

const fetchFoodRecords = async (req, res) => {
  const { page, search_term } = req.query;
  console.log("Request query:", page, search_term); // Add this logging
  const filter = {
    page: parseInt(+page) || 1, // Convert page to a number, default to 1 if not provided
  };
  console.log("Filter:", filter); // Add this logging
  let keyword_search = {};

  if (search_term) {
    const search_regex = new RegExp(search_term, "i");
    keyword_search = {
      $or: [
        { fdc_id: search_regex },
        { _id: search_regex },
        { data_type: search_regex },
        { description: search_regex },
      ],
    };
  }

  try {
    const skipValue = (filter.page - 1) * PAGINATION;
    console.log("Skip value:", skipValue); // Add this logging
    const limitValue = PAGINATION;
    console.log("Limit value:", limitValue); // Add this logging
    console.log("Request query:", filter.page);
    const foodsRecords = await FoodModule.Food.aggregate([
      {
        $match: keyword_search,
      },

      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
            {
              $addFields: {
                current_page: filter.page,
                has_next_page: {
                  $cond: {
                    if: {
                      $lt: [{ $multiply: [filter.page, PAGINATION] }, "$total"],
                    },
                    then: true,
                    else: false,
                  },
                },
                has_previous_page: {
                  $cond: {
                    if: {
                      $gt: [filter.page, 1],
                    },
                    then: true,
                    else: false,
                  },
                },
                next_page: {
                  $add: [filter.page, 1],
                },
                previous_page: {
                  $cond: {
                    if: {
                      $gt: [filter.page, 1],
                    },
                    then: {
                      $subtract: [filter.page, 1],
                    },
                    else: 1,
                  },
                },
                last_page: {
                  $ceil: {
                    $divide: ["$total", PAGINATION],
                  },
                },
              },
            },
          ],
          records: [
            {
              $skip: skipValue,
            },
            {
              $limit: limitValue,
            },
          ],
        },
      },
    ]);

    const returnData = {
      foodsRecords: [],
      metadata: undefined,
    };

    if (foodsRecords[0].metadata[0]) {
      returnData.foodsRecords = foodsRecords[0].records;
      const [metadata] = foodsRecords[0].metadata;
      returnData.metadata = metadata;
    } else {
      returnData.foodsRecords = foodsRecords[0].records;
      returnData.metadata = {
        total: 0,
        current_page: 1,
        has_next_page: false,
        has_previous_page: false,
        next_page: 2,
        previous_page: 1,
        last_page: 1,
      };
    }

    return res.status(200).send(returnData);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};
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

module.exports = { fetchFoodRecords, createFood };
