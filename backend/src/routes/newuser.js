import express from 'express'
import dbclient from '../lib/db.js'
//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log("POOP", req.body)
    
    const username = req.body.username
    console.log("RECEIVEDUSERNAME", username)
    const dbName = "myDatabase"
    const collectionName = "users"

    const database = dbclient.db(dbName)
    const collection = database.collection(collectionName)

    await dbclient.connect()

    const user = [
        {
        "username": username
        }
    ]
    const result = await collection.insertMany(user)
    console.log("RES", result)
    res.json({ newuser: true });
    await dbclient.close()
});

export default router;

