const express = require('express');
const router = express.Router();
const { getPlans, selectPlan, cancelPlan } = require('../controllers/planController');
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/', getPlans);
router.post('/select', verifyToken, selectPlan);
router.post('/cancel', verifyToken, cancelPlan);
module.exports = router;
