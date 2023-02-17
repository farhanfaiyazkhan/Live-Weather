const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); //need not to install this package as it is native node module
const { dirname } = require("path");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){

    const query = req.body.city;
    const appID = process.env.APP_ID;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appID + "&units=" + unit;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data); //JSON. parse turns hexadecimal into JSON.
            console.log(weatherData);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<h1>The temperature in " + query + " is " + temp + " degree celsius.</h1>")
            res.write("<p>The weather is currently " + description + ".</p>"); //you can have multiple res.write 
            res.write("<img src=" + imageURL + ">");
            res.send();// you can have only one send method in get.
        });
    });
});







app.listen(3000, function(){
    console.log("Server is running on port 3000...");
});
