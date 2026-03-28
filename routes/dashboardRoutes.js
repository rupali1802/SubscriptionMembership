const express = require('express');
const router = express.Router();
const { getActivePlan } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/active-plan', verifyToken, getActivePlan);
module.exports = router;
