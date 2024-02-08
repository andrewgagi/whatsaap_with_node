const { check, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: errorMessages });
  }
  next();
};

const foodValidator = [
  check("fdc_id")
    .notEmpty()
    .withMessage("dc_id is required")
    .isNumeric()
    .withMessage("Invalid  format")
    .trim(),
  check("data_type")
    .notEmpty()
    .withMessage("data_type is required")
    .isString()
    .withMessage("Invalid  format")
    .trim(),
  check("description")
    .notEmpty()
    .withMessage("descriptionis required")
    .isString()
    .withMessage("Invalid  format")
    .trim(),
  check("publication_date")
    .notEmpty()
    .withMessage("publication_dateis required")
    .trim(),

  handleValidationErrors,
];

module.exports = foodValidator;
