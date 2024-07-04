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

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../public')));

// API ルーティングの設定
app.use('/api/users', userRoutes);
app.use('/api/reading-logs', readingLogRoutes);

// API のデフォルトルート
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Kids Reading Tracker API' });
});

// その他のルートは React アプリにリダイレクト
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
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

module.exports = app;