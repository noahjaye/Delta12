import express from 'express'
import dbclient from '../lib/db.js'
//import passcheck from '../lib/passcheck.js';

const router = express.Router();

router.post('/', async (req, res) => {
    email = req.body.email
    check = await passcheck()
    res.json({ inviteSent: true });
});

router.get('/', async (req, res) => {
    console.log("INTHISLIFE")
})

export default router;