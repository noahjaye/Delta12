import express from 'express'
import {dbclient, getDb} from '../lib/db.js'

//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const username = req.body.username
    let drugs = req.body.drugs
    console.log("RECEIVEDDOCDRUG", drugs, typeof(drugs))
    drugs.taken = 0
    const database = await getDb()
    const collection = database.collection("users")

    await dbclient.connect()


    const result = await collection.updateOne(
    { username: username }, 
    { $push: { drugs: drugs } } 
    );
    console.log("RES", result)
    res.json({ drugs: true });

});

export default router;

