const { Router } = require('express');
const { assessCode } = require('../controller/gptController');

const router = Router();

// Route for handling code assessment with GPT
router.post('/gpt/assess', assessCode);

module.exports = router;
