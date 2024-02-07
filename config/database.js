require("dotenv").config();

let url;

switch (process.env.NODE_ENV) {
  case "staging":
    url = process.env.MONGO_URI;
    break;
  case "production":
    url = process.env.MONGO_URI;
    break;
  default:
    // Use the default MongoDB Atlas URL
    url = "mongodb+srv://andrew:11leTSF4CCEOaXrJ@cluster0.aux8ml3.mongodb.net/";
}

module.exports = {
  url: url,
};
