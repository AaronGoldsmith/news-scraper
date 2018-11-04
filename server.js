// Dependencies
var bodyParser   = require("body-parser")  //\   JSON parser
var express = require("express");         //  |   server 
var mongoose = require("mongoose");      //   |   ORM
var axios   = require('axios');        //=====|   BKND
var cheerio = require("cheerio");     //      |   DOM     
var logger  = require('morgan')      //       |   LOGGER  
                                    //        |   model 
require('./models/Article') 
var PORT = process.env.PORT || 3000;


 // Initialize Express
 // Setup [ using body-parser, dev logging, static folder]

var app = express();
app.use(logger("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})
);


var db = require('./models')
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI);

  

// Retrieve data from the db
app.get("/articles", function(req, res) {
  // Find all results from the Onion collection in the db
  db.Article.find({})
    .then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
  // .populate("note")
    
});

app.delete("/delete/:id",function(req,res){
  console.log("attempting to delete")
  db.Article.deleteOne({_id:req.params.id},function(){res.send(true)})  
})


// Scrape data from one site and place it into the mongodb db
app.get("/clearall",function(req,res){
  db.Article.deleteMany({})
  res.send(true);
})

app.get("/scrape", function(req, res) {
  axios.get("https://www.theonion.com/").then(function(response) {
     var $ = cheerio.load(response.data);
     $(".post-wrapper").each(function(i, element){ // if this doesn't work try with `this`
      const headline = $(this).find(".headline").text();                   // don't touch
      const anchor = $(this).find("article").find("figure a").attr("href") // don't touch
      const unique = $(this).find("article").attr('id').split("_")[1] // don't touch
      const shortsum = $(this).children().find(".entry-summary").text() // don't touch
      const image = $(this).children().find("source").attr('data-srcset') || 'https://picsum.photos/200/300' // don't touch
      var postObj = {
            headline : headline,
            anchor : anchor,
            unique: unique,
            shortsum : shortsum,
            image : image
      }

      if(headline && image){
        db.Article.create(postObj).then(function(dbArticle){
          console.log(dbArticle);
          res.json(dbArticle);
        }).catch(function(err){
          throw err;
        })
      }
    });
    // res.send("finished scraping")
  }).catch(function(err){
    throw err;
  });
});
// Listen on port 3000
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});
