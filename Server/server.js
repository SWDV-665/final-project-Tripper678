var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/meals");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

const {Schema} = mongoose;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const MealSchema = new Schema({
    date: String,
    mealName: String,
    totalCalories: Number,
    protein: Number,
    sugar: Number,
    carbohydrates: Number,
});

const Meal = mongoose.model('Meal', MealSchema);


// Get all meals
app.get('/api/meals', function (req, res) {

    console.log("Listing all meals");

    //get all meals in the database
    Meal.find(function (err, meal) {

        // if there is an error send the error.
        if (err) {
            res.send(err);
        }

        res.json(meal); // return all meals in JSON format
        console.log(meal);
    });
});

// Get all meals with a specific date
app.get('/api/meals/:date', function (req, res) {
    console.log("Listing all meals with the specified date");

    //find all documents that match the date passed in 
    Meal.find({date: req.params.date}, function (err, meal) {

        if (err) {
            res.send(err);
        }

        res.json(meal); 
        console.log(meal);
    });
});

// Create a meal Item.
app.post('/api/meals', function (req, res) {

    console.log("Creating meal item...");

    //Add the data from the request to the meal document.
    Meal.create({
        date: req.body.date,
        mealName: req.body.mealName,
        totalCalories: req.body.totalCalories, 
        protein: req.body.protein,
        sugar: req.body.sugar,
        carbohydrates: req.body.carbohydrates,   
        done: false
    }, function (err, meal) {
        if (err) {
            res.send(err);
        }

        // create and return all the meals
        Meal.find(function (err, meals) {
            if (err)
                res.send(err);
            res.json(meals);
        });
    });

});

// Delete a meal Item
app.delete('/api/meals/:id', function (req, res) {
    //The the meal item with the id that matches the argument from the request.
    Meal.deleteOne({
        _id: req.params.id
    }, function (err, meal) {
        if (err) {
            console.error("Error deleting meal ", err);
        }
        else {
            Meal.find(function (err, meals) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(meals);
                }
            });
        }
    });
});


//Delete all entries in the meal database
app.delete('/api/meals', function (req, res) {
    Meal.deleteMany({}, function (err, meal) {
        if (err) {
            console.error("Error deleting meal ", err);
        }
        else {
            Meal.find(function (err, meals) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(meals);
                }
            });
        }
    });
});

// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Meals server listening on port  - ", (process.env.PORT || 8080));
