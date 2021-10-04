const express = require('express');
const router = express.Router();


const {insertCategory,list,read,categoryById,removeCategory} = require('../../controllers/admin-item/category');
router.param('categoryId', categoryById);
router.get('/admin/category/:categoryId', read);
router.post('/admin/category/categoryAdd',insertCategory);

router.get('/admin/categories', list);
//route for delete single product
router.delete('/admin/category/:categoryId',removeCategory);

module.exports = router;