import express from 'express'
import {dbclient, getDb} from '../lib/db.js'
//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    
    const username = req.body.username
    console.log("RECEIVEDUSERNAME", username)

    const database = await getDb()
    const collection = database.collection("users")

    await dbclient.connect()

    const user = [
        {
        "username": username
        }
    ]
    const result = await collection.insertMany(user)
    console.log("RES", result)
    res.json({ newuser: true });
});

export default router;

