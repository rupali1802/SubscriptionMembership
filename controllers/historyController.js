const db = require('../config/database');

const getLoginHistory = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT id, login_time, ip_address FROM login_history 
     WHERE user_id = ? 
     ORDER BY login_time DESC 
     LIMIT 100`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch login history.' });
      res.json(results);
    }
  );
};

const getPlanHistory = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT id, plan_name, plan_price, start_date, end_date, status, action_date 
     FROM plan_history 
     WHERE user_id = ? 
     ORDER BY action_date DESC 
     LIMIT 100`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch plan history.' });
      res.json(results);
    }
  );
};

const recordLogin = (userId, ipAddress, userAgent, callback) => {
  db.query(
    'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
    [userId, ipAddress, userAgent],
    callback
  );
};

const recordPlanChange = (userId, planId, planName, planPrice, startDate, endDate, status, callback) => {
  db.query(
    `INSERT INTO plan_history (user_id, plan_id, plan_name, plan_price, start_date, end_date, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, planId, planName, planPrice, startDate, endDate, status],
    callback
  );
};

module.exports = { getLoginHistory, getPlanHistory, recordLogin, recordPlanChange };
