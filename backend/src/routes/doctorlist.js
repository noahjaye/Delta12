import express from 'express'
import {dbclient, getDb} from '../lib/db.js'

//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    
    const username = req.body.username
    console.log("doctorlist", username)

    const database = await getDb()
    const collection = database.collection("users")
    await dbclient.connect()

    const parsed = await JSON.stringify(result)
    console.log("PARSED", parsed)

    result = await collection.updateOne(
    { username: username }, // Filter for the document
    { $set: { drugs: drugs } } // Push a new score into the 'scores' array
    );

    res.json({ user: parsed })

});

export default router;

