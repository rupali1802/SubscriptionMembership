const express = require('express');
const { getLoginHistory, getPlanHistory } = require('../controllers/historyController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/login-history', verifyToken, getLoginHistory);
router.get('/plan-history', verifyToken, getPlanHistory);

module.exports = router;
