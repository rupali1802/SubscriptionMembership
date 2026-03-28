const db = require('../config/database');
const { recordPlanChange } = require('./historyController');

const getPlans = (req, res) => {
  db.query('SELECT * FROM subscription_plan', (err, results) => {
    if (err) return res.status(500).json({ message: 'Could not fetch plans.' });
    res.json(results);
  });
};

const selectPlan = (req, res) => {
  const userId = req.user.id;
  const { planId } = req.body;

  db.query(
    "SELECT * FROM membership WHERE user_id = ? AND status = 'active'",
    [userId],
    (err, active) => {
      if (err) return res.status(500).json({ message: 'DB error.' });
      if (active.length > 0) return res.status(400).json({ message: 'You already have an active plan.' });

      db.query('SELECT * FROM subscription_plan WHERE id = ?', [planId], (err, plans) => {
        if (err || plans.length === 0) return res.status(404).json({ message: 'Plan not found.' });

        const plan = plans[0];
        db.query(
          `INSERT INTO membership (user_id, plan_id, start_date, end_date, status)
           VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY), 'active')`,
          [userId, planId, plan.duration_days],
          (err) => {
            if (err) return res.status(500).json({ message: 'Could not assign plan.' });
            
            // Record in plan history
            const startDate = new Date().toISOString().split('T')[0];
            const endDate = new Date(Date.now() + plan.duration_days * 86400000).toISOString().split('T')[0];
            recordPlanChange(userId, planId, plan.name, plan.price, startDate, endDate, 'active', () => {});
            
            res.json({ message: `${plan.name} plan activated successfully!` });
          }
        );
      });
    }
  );
};

const cancelPlan = (req, res) => {
  const userId = req.user.id;
  db.query(
    "UPDATE membership SET status = 'cancelled' WHERE user_id = ? AND status = 'active'",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Could not cancel plan.' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'No active plan to cancel.' });
      
      // Record cancellation in plan history
      db.query(
        "SELECT m.*, sp.name, sp.price FROM membership m JOIN subscription_plan sp ON m.plan_id = sp.id WHERE m.user_id = ? AND m.status = 'cancelled' ORDER BY m.id DESC LIMIT 1",
        [userId],
        (err, results) => {
          if (results && results.length > 0) {
            const r = results[0];
            recordPlanChange(userId, r.plan_id, r.name, r.price, r.start_date, r.end_date, 'cancelled', () => {});
          }
        }
      );
      
      res.json({ message: 'Plan cancelled successfully.' });
    }
  );
};

module.exports = { getPlans, selectPlan, cancelPlan };
