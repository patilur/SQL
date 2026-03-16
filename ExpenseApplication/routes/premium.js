const express = require('express');
const router = express.Router();

const leaderboardController = require('../controller/leaderBoardController');
const userAuth = require('../middleware/auth');

router.get('/leaderboard', userAuth.authenticate, leaderboardController.getLeaderboard);

module.exports = router;