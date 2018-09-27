// Dependencies
var bp      = require("body-parser")      //\   JSON parser
var express = require("express");        // |   server 
var mongojs = require("mongoose");      //  |   ORM
var request = require("request");      //   |   GET
var mongojs = require("mongojs")      //    |   DB
var axios   = require('axios');      //=====|   BKND
var cheerio = require("cheerio");   //      |   DOM     
var logger  = require('morgan')    //       |   LOGGER  
                                  //        |   model 
var models  = require('./models/Article') 


 // Initialize Express
 // Setup [ using body-parser, dev logging, static folder]

var app = express();
app.use(logger("dev"));
app.use(express.static("public"));
app.use(
  bp.urlencoded({
    extended: false
  })
);


// Database configuration
var databaseUrl = "scraper";
var collections = ["onion"];


// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
var db = require('./models/Article')
db.on("error", function(error) {
  console.log("Database Error:", error);
});


mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });


app.get("/", function(req, res) {
  res.send(index.html);
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the Onion collection in the db
  db.onion.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});
app.delete("/delete/:id",function(req,res){
  console.log("attempting to delete")
  db.onion.remove({_id:mongojs.ObjectId(req.params.id)})  
})
app.get("/find/:id",function(req,res){
  console.log('hitting a find');
  db.onion.find({_id:mongojs.ObjectId(req.params.id)},function(err,response){
    if(!err){
      res.json(response)
    }
    else{
      console.log(err)
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/clearall",function(req,res){
  db.onion.drop()
  res.send(true);
})
axios.get("/scrape", function(req, res) {
  request("https://www.theonion.com/", function(error, response, html) {
   if(!error){
     const $ = cheerio.load(html);
     $(".post-wrapper").each(function(i, element){ // if this doesn't work try with `this`
      var headline = $(element).find(".headline").text();                   // don't touch
      var anchor = $(element).find("article").find("figure a").attr("href") // don't touch
      var unique = $(element).find("article").attr('id').split("_")[1] // don't touch
      var shortsum = $(element).children().find(".entry-summary").text() // don't touch
      var image = $(element).children().find("source").attr('data-srcset') // don't touch
      var tempID = inserted.unique.substring(inserted.unique.length/2);
      var postObj = {
            headline : headline,
            anchor : anchor,
            shortsum : shortsum,
            image : image,
            unique: unique
      }
      if(headline && anchor && shortsum){
        db.Article.create(postObj).then(function(inserted){ 
          console.log("inserted \n" + inserted)
        })
        .catch(function(err){
          return res.json(err);
        });   
      }
      else{
        console.log("couldn't get data from the site")
      }
  })
    res.send("finished scraping")
    }
  });
});
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
