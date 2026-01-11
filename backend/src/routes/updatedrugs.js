import express from 'express'
import {dbclient, getDb} from '../lib/db.js'

//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const username = req.body.username
    const drugs = req.body.drugs
    console.log("RECEIVEDDRUG", drugs)

    const database = await getDb()
    const collection = database.collection("users")

    await dbclient.connect()


    const result = await collection.updateOne(
    { username: username }, // Filter for the document
    { $set: { drugs: drugs } } // Push a new score into the 'scores' array
    );
    console.log("RES", result)
    res.json({ drugs: true });

});

export default router;

