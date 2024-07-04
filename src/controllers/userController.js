const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ユーザーの作成
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, users[0].password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: users[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login successful',
      token,
      userId: users[0].id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// 必要に応じて追加の関数をここに実装できます
// 例: ユーザープロフィールの取得、更新など