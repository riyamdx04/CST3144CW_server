var express = require("express");
const path = require("path");
const morgan = require('morgan');
const cors = require("cors");
//var propertiesReader = require("properties-reader");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;
const StudentID = 'M01015301';

//array for orders and products
let orders=[];

//setting up the database
// let properties = propertiesReader(path.resolve(__dirname,"./db.properties"));
// let dbPrefix = properties.get("db.prefix");

// //for potential special characters
// let dbUsername = encodeURIComponent(properties.get("db.user"));
// let dbPwd = encodeURIComponent(properties.get("db.pwd"));
// let dbHost = properties.get("db.host");
// let dbParams = properties.get("db.params");
const uri = `mongodb+srv://riyamdx04_db_user:BSC3c55e@cluster0.rhekonx.mongodb.net/`;

//setting up MongoDB client 
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db;

//setting up the app
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

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

//retrieving existing collections from database
app.param('collectionName', async function (req,res,next,collectionName) {
    req.collection = DbTuition.collection(collectionName);
    console.log('Middleware collection name:', req.collection.collectionName);
    next();
})
//get method to retrieve all the subjects displayed
// console.log(classes);
app.get(`/${StudentID}/lessons/:collectionName`, async function(req,res, next){
    // req.collection.find({}).toArray(function(err,results){
    //     if(err){
    //         return next(err)
    //     }
    //     res.send(results);
    const results =await req.collection.find({}).toArray();
    res.json(results);
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
//PUT method to change and update available spaces 
app.put(`/${StudentID}/lessons/seats/:id`, function(req,res){
    res.send("update the available seats")
});

//POST method for orders placed by user
app.post(`/${StudentID}/lessons/orders`, async(req,res)=>{
    const {name, phone, LessonID, noOfSeats}= req.body;

    //creating an id for order
    const order= {OrderID: orders.length, name, phone, LessonID, noOfSeats};
    orders.push(order);
    res.json(order);

});
//section to upload image as static files
// var publicPath = path.resolve(__dirname, StaticFiles);
// app.use("/folderName", express.static(publicPath));

app.use((req, res) => {
    res.status(404).send("Page not found !")
});

//launching the server
app.listen(PORT, function() {
    console.log(`listening on: http://localhost:${PORT}/${StudentID}`);
});