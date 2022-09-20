// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var newArray = [];

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/all", function(req, res){
  db.scrapedData.find({}, function(err, found){
    if(err) throw err;
    else{
      res.json(found);
    }
  });
});


// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get("/scrape", function(req, res){
  request("https://www.reddit.com/r/stargate", function(error, response, html){
    var $ = cheerio.load(html);

    $("a.SQnoC3ObvgnGjWt90zD9Z").each(function(i, element){
      var link = $(element).attr("href");
      var title = $(element).children("h2").text();

      if(link && title){
        db.scrapedData.insert({
          title:title,
          link:link
        });
      }
      }, function(error, found){
        if(error) throw error;
        else{
          console.log(found);
        }
    });
  });
  res.send("Scrape Completed")
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
