const express = require('express');
const router = express.Router();

const { insert,
        promotionById,
        read,
        remove,
        update,
        list,
        promoImage
} = require('../../controllers/admin-offers/promotion');

//route method

router.post('/admin/promotion/insert', insert);

router.get('/admin/promotions', list);
router.get('/admin/promotion/:promotionId', read);
router.get('/admin/promotion/image/:promotionId', promoImage);

router.put('/admin/promotion/:promotionId', update);

router.delete('/admin/promotion/:promotionId', remove);

router.param('promotionId', promotionById);

module.exports = router;