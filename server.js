const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.log('DB connection error:', err);
  } else {
    console.log('MySQL Connected...');
  }
});

/* ---------------- HOME ROUTES ---------------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

/* ---------------- PRODUCTS APIs ---------------- */
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products ORDER BY id DESC', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category, price, image, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.query(
    'INSERT INTO products (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)',
    [name, category || '', price, image || '', description || ''],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Insert failed' });
      }
      res.json({ message: 'Product added successfully' });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { name, category, price, image, description } = req.body;

  db.query(
    'UPDATE products SET name=?, category=?, price=?, image=?, description=? WHERE id=?',
    [name, category || 'Chair', price, image || '', description || '', req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Update failed' });
      }
      res.json({ message: 'Product updated' });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Delete failed' });
    }
    res.json({ message: 'Product deleted' });
  });
});

/* ---------------- TESTIMONIAL APIs ---------------- */
app.get('/api/testimonials', (req, res) => {
  db.query('SELECT * FROM testimonials ORDER BY id DESC', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

app.post('/api/testimonials', (req, res) => {
  const { name, role, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  db.query(
    'INSERT INTO testimonials (name, role, message) VALUES (?, ?, ?)',
    [name, role || '', message],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Insert failed' });
      }
      res.json({ message: 'Testimonial added successfully' });
    }
  );
});

app.put('/api/testimonials/:id', (req, res) => {
  const { name, role, message } = req.body;

  db.query(
    'UPDATE testimonials SET name=?, role=?, message=? WHERE id=?',
    [name, role || '', message, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Update failed' });
      }
      res.json({ message: 'Testimonial updated' });
    }
  );
});

app.delete('/api/testimonials/:id', (req, res) => {
  db.query('DELETE FROM testimonials WHERE id=?', [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Delete failed' });
    }
    res.json({ message: 'Testimonial deleted' });
  });
});

/* ---------------- ADMIN LOGIN API ---------------- */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM admins WHERE username=? AND password=?',
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Login failed' });
      }

      if (result.length > 0) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log('Contact form data:', req.body);

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query(
    'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
    [name, email, phone, message],
    (err, result) => {
      if (err) {
        console.log('CONTACT ERROR:', err);
        return res.status(500).json({ error: 'Failed to save contact form' });
      }

      res.json({ success: true, message: 'Message sent successfully' });
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
