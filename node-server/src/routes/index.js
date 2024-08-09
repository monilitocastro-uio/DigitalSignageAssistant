import express from "express";
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    console.log('req.query:', req.query);   
    res.render('index', { title:"Home", message: "Welcome!!!!" });
});

export default router;
