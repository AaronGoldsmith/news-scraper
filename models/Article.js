var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  headline: {
    type: String,
    required: true,
  },
  anchor: {
    type: String,
    required: true
  },
  shortsum:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: false,
    default: "https://pbs.twimg.com/profile_images/875392068125769732/yrN-1k0Y.jpg"
  },
  unique:{
    type: String,
    required: true,
    unique: true
  }
  
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
