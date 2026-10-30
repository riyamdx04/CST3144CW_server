var express = require("express");
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const PORT = 3000;

//setting the app
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//getting all the subjects displayed
let classes = require('../../test/test/VueJS/products.js');
console.log(classes);
app.get("/lessons", function(req,res){
    res.json(classes);
});

//taking the input for searching subject names
app.get("/lessons/search", function(req,res){

}); 
//PUT method to change and update available spaces 
app.put("/", function(req,res){
    res.send("update the available seats")
});

app.use((req, res) => {
    res.status(404).send("Page not found !")
});

//launching the server
app.listen(3000, function() {
    console.log(`listening on: http://localhost:${PORT}`);
});