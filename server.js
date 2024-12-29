const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

// User Registration Route
app.post('/register', (req, res) => {
  const { username, email, password, phoneNumber, gender, dob } = req.body;

  // Hash the password before saving to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const query = 'INSERT INTO users (username, email, password, phoneNumber, gender, dob) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, phoneNumber, gender, dob], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// User Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;


  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token for authentication
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login successful',
        token: token
      });
    });
  });
});

// Forgot Password Route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    res.status(200).json({ message: 'Email exists, please provide new password' });
  });
});


// Change Password Route
app.post('/reset-password', (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Check if the passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Query the database to fetch the user's current password
  const query = 'SELECT password FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user data', error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentPassword = result[0].password; // The current password from the database

    // Compare the new password with the current password
    bcrypt.compare(newPassword, currentPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords', error: err });
      }

      if (isMatch) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' });
      }

      // Hash the new password before saving to the database
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password', error: err });
        }

        // Update the password in the database
        const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(updateQuery, [hashedPassword, email], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating password', error: err });
          }
          res.status(200).json({ message: 'Password updated successfully' });
        });
      });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
