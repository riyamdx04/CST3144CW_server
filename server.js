var express = require("express");
const path = require("path");
const morgan = require('morgan');
const cors = require("cors");

const app = express();
const PORT = 3000;
const StudentID = 'M01015301';
let DbTuition;

//setting up the app
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
//array for orders and products
// let orders=[];

//const uri = `mongodb+srv://riyamdx04_db_user:BSC3c55e@cluster0.rhekonx.mongodb.net/`;
//loading the config from .env file to process
require("dotenv").config({ path: path.resolve(__dirname,'config.env')});
const { MongoClient } = require("mongodb");
const uri = 
process.env.MONGODB_PREFIX +
encodeURIComponent(process.env.MONGODB_USERNAME) + ":" +
encodeURIComponent(process.env.MONGODB_PASSWORD)+
process.env.MONGODB_URL;
const client = new MongoClient(uri);

//creating connection with database
async function connectToDb(){
    try{
        client.connect();
        console.log("Connected to Database");
        DbTuition = client.db('Webstore');
    }
    catch(err){
        console.error('Connection to MongoDB failed: ', err);
    }
}
//launching the connection to MongoDB
connectToDb();

//get method to retrieve all the subjects displayed
// console.log(classes);
app.get(`/${StudentID}/lessons`, async function(req,res, next){
    try{    
    const results =await DbTuition.collection('products').find({}).toArray();
    res.json(results);
    //console.log(results);
    // res.send(results);
    }
    catch(error){
        console.log("cannot obtain the collection data from DB: ", error)
    }
});

//taking the input for searching subject names
app.get(`/${StudentID}/lessons/search`, async (req,res) =>{
    const searchTerm = (req.query.q).toLowerCase().trim();
    //if search field is empty, all the classes will be displayed
    if(!searchTerm){
        return res.json(classes);
    };
    //creating results constant with in-built filters
    const results = classes.filter(c=>
        c.SubjectName.toLowerCase().includes(searchTerm) ||
        c.Location.toLowerCase().includes(searchTerm) ||
        String(c.Price.includes(searchTerm))
    );
    res.json(results);
}); 
//POST method for orders placed by user
app.post(`/${StudentID}/lessons/orders`, async function(req,res){
    try{
        const{name,phone,address,title} = req.body;
        let collection = await DbTuition.collection("orders");
        let results = await collection.insertOne(req.body);
        console.log("the data has been added: ", results);
        res.json(results);
    }
    catch(Err){
        console.error("Error inserting new document: ", Err.message);
    }
});

//PUT method to change and update available spaces 
app.put(`/${StudentID}/lessons/:id`, async (req,res) =>{
    res.send("update the available seats")
});

//section to upload image as static files
// var publicPath = path.resolve(__dirname, StaticFiles);
// app.use("/folderName", express.static(publicPath));

app.use(express.static(path.join(__dirname,'public')));
app.use((req, res) => {
    res.status(404).send("Page not found !")
});

//launching the server
app.listen(PORT, function() {
    console.log(`listening on: http://localhost:${PORT}/${StudentID}/lessons`);
});