const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/boardController');

router.post('/', auth, controller.createBoard);
router.get('/', auth, controller.getBoards);
router.delete('/:id', auth, controller.deleteBoard);

module.exports = router;
