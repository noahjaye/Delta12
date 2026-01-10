import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//routes
import inviteRouter from './routes/invite.js'
import login from './routes/login.js'

dotenv.config({path: './secrets/backend.env'});

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'], // Next dev server
  credentials: true,
}));

app.use(express.json());

// Track the counter value received from Genuino 101
let counterValue = 0;

//use routers here
app.use('/invite', inviteRouter)
app.use('/signup', login)


app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  res.json({ token: 'fake-token' });
  console.log("LOGIN CALL")
});

// Endpoint for Genuino to update counter value via BLE
app.post('/counter/update', (req, res) => {
  const { value } = req.body;
  if (typeof value === 'number') {
    counterValue = value;
    console.log(`Counter updated to: ${counterValue}`);
    res.json({ success: true, counter: counterValue });
  } else {
    res.status(400).json({ error: 'Invalid value' });
  }
});

app.get('/counter', (req, res) => {
  res.json({ counter: counterValue });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
