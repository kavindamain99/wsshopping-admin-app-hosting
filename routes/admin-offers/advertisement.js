const express = require('express');
const router = express.Router();

const { insert, 
        advertisementById,
        read,
        remove,
        update,
        list,
        adImage
} = require('../../controllers/admin-offers/advertisement');

//route method

router.post('/admin/advertisement/insert', insert);

router.get('/admin/advertisements', list);
router.get('/admin/advertisement/:advertisementId', read);
router.get('/admin/advertisement/image/:advertisementId', adImage);

router.put('/admin/advertisement/:advertisementId', update);

router.delete('/admin/advertisement/:advertisementId', remove);

router.param("advertisementId", advertisementById);

module.exports = router;