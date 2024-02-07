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

const recordValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("Invalid  format")
    .trim(),
  check("phone_number")
    .notEmpty()
    .withMessage("phone is required")
    .isString()
    .withMessage("Invalid  format")
    .trim(),
  check("text")
    .notEmpty()
    .withMessage("text is required")
    .isString()
    .withMessage("Invalid  format")
    .trim(),
  check("time")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("Invalid date  format")
    .trim(),

  handleValidationErrors,
];

module.exports = recordValidator;
