const pool = require('../config');

exports.addReadingLog = async (req, res) => {
  try {
    const { book_title, pages_read, minutes_read, date } = req.body;
    const user_id = req.userData.userId;
    const [result] = await pool.query(
      'INSERT INTO reading_logs (user_id, book_title, pages_read, minutes_read, date) VALUES (?, ?, ?, ?, ?)',
      [user_id, book_title, pages_read, minutes_read, date]
    );
    res.status(201).json({ message: 'Reading log added successfully', logId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reading log', error: error.message });
  }
};

exports.getReadingLogs = async (req, res) => {
  try {
    const user_id = req.userData.userId;
    const [logs] = await pool.query(
      'SELECT * FROM reading_logs WHERE user_id = ? ORDER BY date DESC',
      [user_id]
    );
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reading logs', error: error.message });
  }
};

exports.updateReadingLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_title, pages_read, minutes_read, date } = req.body;
    const userId = req.userData.userId;

    const [result] = await pool.execute(
      'UPDATE reading_logs SET book_title = ?, pages_read = ?, minutes_read = ?, date = ? WHERE id = ? AND user_id = ?',
      [book_title, pages_read, minutes_read, date, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reading log not found or you do not have permission to update it' });
    }

    const [updatedLog] = await pool.execute('SELECT * FROM reading_logs WHERE id = ?', [id]);

    res.json({ message: 'Reading log updated successfully', updatedLog: updatedLog[0] });
  } catch (error) {
    console.error('Update reading log error:', error);
    res.status(500).json({ message: 'Error updating reading log', error: error.message });
  }
};

exports.deleteReadingLog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userData.userId;

    const [result] = await pool.execute(
      'DELETE FROM reading_logs WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reading log not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Reading log deleted successfully' });
  } catch (error) {
    console.error('Delete reading log error:', error);
    res.status(500).json({ message: 'Error deleting reading log', error: error.message });
  }
};