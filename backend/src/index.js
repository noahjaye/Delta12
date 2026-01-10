import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//routes
import newuser from './routes/newuser.js'
dotenv.config({path: './secrets/backend.env'});

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'], // Next dev server
  credentials: true,
}));

app.use(express.json());

//use routers here
app.use('/newuser', newuser)
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  res.json({ token: 'fake-token' });
  console.log("LOGIN CALL")
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
