import express from 'express'
import {dbclient, getDb} from '../lib/db.js'
//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    
    const username = req.body.username
    const doctor = req.body.doctor
    console.log("RECEIVEDUSERNAME", username)
    console.log("RECDOC", doctor)

    const database = await getDb()
    const users = database.collection("users")
    const doctors = database.collection("doctors")
    await dbclient.connect()

    const user = [
        {
        "username": username
        }
    ]
    const result = await users.insertMany(user)
    console.log("RES", result)
    res.json({ newuser: true });
});

export default router;

