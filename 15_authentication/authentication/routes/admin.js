const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
// Protect route
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
/* and isAuth can now simply be added as an argument to get 
  and you can add as many arguments as you want, as many handlers 
  as you want therefore and as I mentioned, they will be parsed 
  from left to right, the request will travel through them from 
  left to right. */
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
