const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quiz',
  password: 'postgres',
  port: 5432,
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  const result = await pool.query('SELECT id, question, option_a, option_b, option_c, option_d FROM questions');
  res.json(result.rows);
});

// Check answer
app.post('/api/answer', async (req, res) => {
  const { questionId, selectedOption } = req.body;
  const result = await pool.query('SELECT correct_option FROM questions WHERE id = $1', [questionId]);
  if (result.rows.length === 0) return res.status(404).json({ correct: false });
  res.json({ correct: result.rows[0].correct_option === selectedOption });
});

app.listen(5000, () => console.log('Server running on port 5000'));