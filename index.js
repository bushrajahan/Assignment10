const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const uri = "mongodb+srv://jbushra781:aSUhgpNZ4qTUlEWl@cluster0.mbyajk2.mongodb.net/userDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const userCollection = client.db("userDB").collection("users");
    app.put('/users/:id', async (req, res) => {
      try {
        const userId = req.params.id;
        const updatedUser = req.body;
        const result = await userCollection.updateOne({ _id: userId }, { $set: updatedUser });
        res.json({ success: result.modifiedCount > 0 });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.json({ _id: result.insertedId });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    // app.delete('/users/:id', async (req, res) => {
    //   try {
    //     const userId = req.params.id;
    //     const result = await userCollection.deleteOne({ _id: userId });
    //     res.json({ success: result.deletedCount > 0 });
    //   } catch (error) {
    //     console.error("Error:", error);
    //     res.status(500).json({ error: "Internal Server Error" });
    //   }
    // });
    
    //read the data from database mongodb 
    app.get('/users',async(req,res)=>{
      const result = await userCollection.find().toArray()
      res.send(result)
    })
    app.get('/users/:brandName',async(req,res)=>{
      const brandName = req.params.brandName;
      const result = await userCollection.find({brandName}).toArray();
      res.json(result)
    })
    app.get("/", (req, res) => {
      res.send("CRUD is running");
    });

    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connnnnnectiig to MongoDB:", error);
  }
}

run().catch(console.error);
