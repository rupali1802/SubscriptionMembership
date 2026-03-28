const db = require('../config/database');

const getActivePlan = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT m.*, sp.name AS plan_name, sp.price,
            DATEDIFF(m.end_date, CURDATE()) AS days_remaining
     FROM membership m
     JOIN subscription_plan sp ON m.plan_id = sp.id
     WHERE m.user_id = ? AND m.status = 'active'
     LIMIT 1`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error.' });
      if (results.length === 0) return res.json({ plan: null });
      res.json({ plan: results[0] });
    }
  );
};

module.exports = { getActivePlan };
