const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'codehub.sqlite'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                section TEXT NOT NULL,
                topic TEXT NOT NULL,
                title TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                category TEXT DEFAULT 'Classwork',
                problem_statement TEXT NOT NULL,
                solution_code TEXT,
                solution_explanation TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Connected to SQLite database.');
    } catch (err) {
        console.error('Database connection error:', err);
    }
})();

// Fetch all questions
app.get('/api/questions', async (req, res) => {
    try {
        const { section, topic, search } = req.query;
        let query = 'SELECT id, section, topic, title, difficulty, category, created_at FROM questions WHERE 1=1';
        const params = [];

        if (section) { query += ' AND section = ?'; params.push(section); }
        if (topic) { query += ' AND topic = ?'; params.push(topic); }
        if (search) {
            query += ' AND (title LIKE ? OR problem_statement LIKE ? OR topic LIKE ?)';
            const wild = `%${search}%`;
            params.push(wild, wild, wild);
        }

        query += ' ORDER BY id DESC';
        const rows = await db.all(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch single question by ID
app.get('/api/questions/:id', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM questions WHERE id = ?', [req.params.id]);
        if (!row) return res.status(404).json({ error: 'Question not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new question (Password removed)
app.post('/api/questions', async (req, res) => {
    try {
        const { section, topic, title, difficulty, category, problem_statement, solution_code, solution_explanation } = req.body;
        const result = await db.run(`
            INSERT INTO questions (section, topic, title, difficulty, category, problem_statement, solution_code, solution_explanation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [section, topic, title, difficulty, category, problem_statement, solution_code, solution_explanation]
        );
        res.status(201).json({ id: result.lastID, message: 'Question created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete question (Password removed)
app.delete('/api/questions/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM questions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));