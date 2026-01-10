// import {Pool} from 'pg'

// const pool = new Pool({
//     database: 'delta',
//     password: 'spacehog',
// })

// export default pool

import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from "dotenv"

dotenv.config({path: './secrets/backend.env'})
const uri = process.env.MONGO_URI
console.log("URIRUNNER")

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dbclient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await dbclient.connect();
    // Send a ping to confirm a successful connection
    await dbclient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await dbclient.close();
  }
}
await run().catch(console.dir);

export default dbclient