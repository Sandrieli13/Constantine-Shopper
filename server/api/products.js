const router = require('express').Router();
const { models: { Product }, supabase } = require('../db');

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching products from Supabase');
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      throw new Error(error.message);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const product = await supabase.from('products').insert(req.body);
    if (product.error) {
      throw new Error(product.error.message);
    }
    res.status(201).send(product.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;