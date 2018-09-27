// Dependencies
var bodyParser = require("body-parser")
   var express = require("express");
   var mongojs = require("mongoose");
   var request = require("request");
   var mongojs = require("mongojs")
   var axios = require('axios')
   var cheerio = require("cheerio");

   var logger  = require('morgan')
   var mongoose = require('mongoose');
   var models = require('./models/Article')


 // Initialize Express
 // Setup [ using body-parser, dev logging, static folder]

var app = express();
app.use(logger("dev"));
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);


// Database configuration
var databaseUrl = "scraper";
var collections = ["onion"];


// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
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
app.get("/scrape", function(req, res) {
  request("https://www.theonion.com/", function(error, response, html) {
   if(!error){
     const $ = cheerio.load(html);
     $(".post-wrapper").each(function(i, element){
      var headline = $(element).find(".headline").text();                   // don't touch
      var anchor = $(element).find("article").find("figure a").attr("href") // don't touch
      var unique = $(element).find("article").attr('id').split("_")[1] // don't touch
      var shortsum = $(element).children().find(".entry-summary").text() // don't touch
      var image = $(element).children().find("source").attr('data-srcset') // don't touch
      
      var postObj = {
            headline : headline,
            anchor : anchor,
            shortsum : shortsum,
            image : image,
            unique: unique
      }
      if(headline && anchor && shortsum){
        db.onion.save( postObj , function(err,inserted){
            if(err){
              console.log("ERROR\n"+err);
            }
            else{
              console.log("inserted\n"+inserted.unique.substring(inserted.unique.length/2))
            }
          })
      }
    else{
      console.log("couldn't get data from the site")
    }
  })
    // Send a "Scrape Complete" message to the browser
    res.send(true)
    }
  })
})
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
