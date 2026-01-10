import express from 'express'
import db from '../lib/db.js'

const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req)
    res.json({ creatingUser: true });

    const emailExist = await db.query("SELECT * FROM users WHERE email = $1", ['BarackPenguin'])
    console.log(emailExist)
    if (emailExist.rowCount == 0) {
        db.query("INSERT INTO users (email, password) VALUES ($1, $2)", ['BarackPenguin', 'pigeon'])
    }
});

export default router;