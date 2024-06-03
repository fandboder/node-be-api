const express = require('express');
const router = express.Router();

// Định nghĩa route
router.get('/', (req, res) => {
    res.send('API Home');
});

module.exports = router;
