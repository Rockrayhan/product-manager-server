// const express = require('express') ;
// const cors = require('cors') ;
// require("dotenv").config() ;
// const app = express();
// const port = process.env.PORT  ;
// app.use(cors()) ;
// app.use(express.json()) ;
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// env config
const env = require("dotenv");
env.config();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

// const uri="mongodb+srv://khayrulalamdict:AdrN0sAmVR43ne6K@cluster0.qdsaagu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // products
    const productDB = client.db("productDB");
    const productsCollection = productDB.collection("productsCollection");

    // users
    const userDB = client.db("usersDB");
    const userCollection = userDB.collection("usersCollection") ;

//=====  product routes =======

// send data
app.post('/blogs', async(req, res) => {
    const productsData = req.body ;
    const result = await productsCollection.insertOne(productsData);
    res.send(result);
}) ;

// get all data
app.get('/blogs', async(req, res) => {
    const productsData =  productsCollection.find();
    const result = await productsData.toArray() ;
    res.send(result);
})

// get data by user email

app.get('/myblogs', async (req, res) => {
  const email = req.query.email;
  console.log('Query email:', email);  // Debugging line
  if (email) {
      const productsData = productsCollection.find({ email }); // Use the correct field name
      const result = await productsData.toArray();
      console.log('Found blogs:', result);  // Debugging line
      res.send(result);
  } else {
      res.status(400).send({ message: 'Email query parameter is required' });
  }
});









// get single data
app.get('/blogs/:id', async(req, res) => {
    const id = req.params.id
    const productsData =  await productsCollection.findOne({_id: new ObjectId(id)});
    res.send(productsData);
})


// update
app.patch('/blogs/:id', async(req, res) => {
    const id = req.params.id
    const updatedData = req.body ;

    const result =  await productsCollection.updateOne(
      { _id: new ObjectId(id) },  
      { $set:updatedData  }  
      
    );
    res.send(result);
})

// delete
app.delete('/blogs/:id', async(req, res) => {
    const id = req.params.id
    const result =  await productsCollection.deleteOne(
      { _id: new ObjectId(id) },  
    );
    res.send(result);
})


// ========= user routes =========

// add user
app.post('/user', async(req, res) => {
  const user = req.body ;
  const isUserExist = await userCollection.findOne({ email: user?.email }) ;
  if (isUserExist?._id){
    return res.send ({
      status: "success",
      message: "Login Success",
    });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
}) ;


// get user
app.get('/user/:email', async(req, res) => {
  const email = req.params.email
  const result =  await userCollection.findOne({ email });
  res.send(result);
})


// update user
app.patch('/user/:email', async(req, res) => {
  const email = req.params.email ;
  const userData = req.body ;
  const result =  await userCollection.updateOne(
    { email },
    {$set : userData},
    { upsert: true });
  res.send(result);
})





    console.log("Database is connected");
  } finally {
    
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
