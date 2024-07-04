const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// データベース設定のインポート
const pool = require('./config');

// ルーティングファイルのインポート
const userRoutes = require('./routes/userRoutes');
const readingLogRoutes = require('./routes/readingLogRoutes');

// エラーハンドラーのインポート
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供を無効化
// app.use(express.static(path.join(__dirname, '../public')));

// API ルーティングの設定
app.use('/api/users', userRoutes);
app.use('/api/reading-logs', readingLogRoutes);

// API のデフォルトルート
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Kids Reading Tracker API' });
});

// その他のルートに対するハンドラを変更
app.use('*', (req, res) => {
  res.status(404).json({ 
    status: 'error',
    statusCode: 404,
    message: 'Not Found: This is a backend API server' 
  });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: err.message || 'Internal Server Error',
  });
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// データベース接続のテスト
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.message);
  } else {
    console.log('Database connection successful');
    connection.release();
  }
});

module.exports = app;