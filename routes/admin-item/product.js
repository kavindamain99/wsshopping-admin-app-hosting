const express = require('express');
const router = express.Router();

const {insert,productById,readProduct,getImage,removeProduct,listProduct,updateProduct,categoryStats} = require('../../controllers/admin-item/product');
router.post('/admin/product/insert',insert);

//route for get single product
router.param("productId",productById);
router.get('/admin/product/:productId',readProduct);

//route for get product image
router.get('/admin/product/image/:productId',getImage);

//route for delete single product
router.delete('/admin/product/:productId',removeProduct);

//return all the products
router.get('/admin/products',listProduct);

//update a single product
router.put('/admin/product/:productId',updateProduct);

router.get('/admin/categoryStats',categoryStats);

module.exports = router;