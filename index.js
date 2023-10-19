
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||  5000

// midleware

app.use(cors())
app.use(express.json())




// data



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtnypra.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const productsData = client.db("productDB").collection("products");

//  post

app.post('/products',async(req,res) =>{

    const user = req.body
    const result = await productsData.insertOne(user);
    res.send(result)
    

})

// get all

 app.get('/products',async(req,res) => {

    const result = await productsData.find().toArray();
    res.send(result);

 })

//  get one

app.get('/products/:brand', async(req,res) => {

    const id = req.params.brand;
    const query = { brand : id.toLowerCase()};
    const result = await productsData.find(query).toArray()
    res.send(result);
})

// get signle data

app.get('/details/:id',async(req,res) => {

    const id = req.params.id;
    const users = { _id : new ObjectId (id)};
    const result = await productsData.findOne(users)
    res.send(result);

})

// update

app.put("/details/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedUSer = {
      $set: {
        name: data.name,
        brand: data.brand,
        price: data.price,
        ratting: data.ratting,
        description: data.description,
        photo: data.photo,
      },
    };
    const result = await productsData.updateOne(
      filter,
      updatedUSer,
      options
    );
    res.send(result);
  });



  // mycart

  // post cat

  const cartData = client.db("productDB").collection("useraddcart");


  app.post('/carts',async(req,res) => {

    const user = req.body
    const result = await cartData.insertOne(user);
    res.send(result)
    

  })

  app.get('/carts',async(req,res) => {
   
    const result = await cartData.find().toArray();
    res.send(result);


  })

  // get one

  app.get('/carts/:id',async(req,res) => {

    const id = req.params.id
    const users = { _id : new ObjectId (id)};
    const result = await cartData.findOne(users)
    res.send(result);
  })


  // delete
  app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    const query = {  _id : new ObjectId (id) };
    const result = await cartData.deleteOne(query);
   
    res.send(result);
  });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})