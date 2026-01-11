import express from 'express'
import {dbclient, getDb} from '../lib/db.js'

//import passcheck from '../lib/passcheck.js';


const router = express.Router();



router.post('/', async (req, res) => {
    
    const username = req.body.username.name
    console.log("nefdoc", username)

    const database = await getDb()
    const collection = database.collection("doctors")
    console.log("CDMIM")
    const result = await collection.updateOne(
        { username },          // existence condition
        {
        $setOnInsert: {
            username
        }
        },
        { upsert: true }
    );

  return {
    created: result.upsertedCount === 1
  };
    res.json({create: true})

});

export default router;

