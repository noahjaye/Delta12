import express from 'express'
import dbclient from '../lib/db.js'
//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    
    const drug = req.body.drug
    console.log("RECEIVEDDRUG", drug)
    const dbName = "myDatabase"
    const collectionName = "users"

    const database = dbclient.db(dbName)
    const collection = database.collection(collectionName)

    await dbclient.connect()


    const result = await collection.updateOne(
    { username: "Jameson" }, // Filter for the document
    { $set: { drugs: drug } } // Push a new score into the 'scores' array
    );
    console.log("RES", result)
    res.json({ drugs: true });
    await dbclient.close()

});

export default router;

