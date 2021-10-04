const express = require('express');
const router = express.Router();

const {orderStatus,orderStats,orderStatsFilteredGreen,orderStatsFilteredYellow,orderStatsFilteredRed} = require('../../controllers/admin-item/status');
router.post('/admin/orderStatus',orderStatus);
router.get('/admin/orderStats',orderStats);
router.get('/admin/orderStatsFiltered/green',orderStatsFilteredGreen);
router.get('/admin/orderStatsFiltered/yellow',orderStatsFilteredYellow);
router.get('/admin/orderStatsFiltered/red',orderStatsFilteredRed);

module.exports = router;