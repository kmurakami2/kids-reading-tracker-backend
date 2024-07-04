const pool = require('../config');

exports.addReward = async (req, res) => {
  try {
    const { name, description, points_required } = req.body;
    const userId = req.userData.userId;

    const [result] = await pool.execute(
      'INSERT INTO rewards (user_id, name, description, points_required) VALUES (?, ?, ?, ?)',
      [userId, name, description, points_required]
    );

    const [newReward] = await pool.execute('SELECT * FROM rewards WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Reward added successfully', reward: newReward[0] });
  } catch (error) {
    console.error('Add reward error:', error);
    res.status(500).json({ message: 'Error adding reward', error: error.message });
  }
};

exports.getRewards = async (req, res) => {
  try {
    const user_id = req.userData.userId;
    const [rewards] = await pool.query('SELECT * FROM rewards WHERE user_id = ?', [user_id]);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};