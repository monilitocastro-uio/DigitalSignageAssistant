const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.send('Home Page');
});

// // Protected Resource Route
// router.get('/protected-resource', verifyToken, (req, res) => {
//     res.json({ message: 'Welcome to the protected resource!', user: req.user });
// });

module.exports = router;
