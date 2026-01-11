import express from 'express'
import {dbclient, getDb} from '../lib/db.js'

//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    
    const username = req.body.username.name
    console.log("grabbinguser", username)

    const database = await getDb()
    const collection = database.collection("users")
    await dbclient.connect()

    const result = await collection.findOne({ username: username })
    const parsed = await JSON.stringify(result)
    console.log("PARSED", parsed)

    res.json({ user: parsed })

});

export default router;

