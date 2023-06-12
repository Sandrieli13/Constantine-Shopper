const router = require('express').Router();
const { models: { Product }} = require('../db');


// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching products from the database');
    const products = await Product.findAll({
      order: ['id']
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = router;