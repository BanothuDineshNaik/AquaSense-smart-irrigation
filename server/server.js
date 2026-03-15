/* ========================================================
   AquaSense — Express Server
   ======================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files (Frontend) ---------- */
app.use(express.static(path.join(__dirname, '..', 'public')));

/* ---------- API Routes ---------- */
app.use('/api', require('./routes/irrigation'));
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/admin', require('./routes/admin'));

/* ---------- Serve Frontend for any other route ---------- */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/* ---------- Start ---------- */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌱 AquaSense server running at http://localhost:${PORT}\n`);
  });
});
