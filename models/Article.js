var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  headline: {
    type: String,
    required: true
  },
  anchor: {
    type: String,
    required: true
  },
  shortsum:{
    type: String,
    required: true
  },
  iamge:{
    type: String,
    required: false
  },
  unique:{
    type: String,
    required: true
  }
  
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
