var express = require('express');
var router = express.Router();

var infoService = require('../services/infoService');

router.get('/', function(req, res, next) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(infoService.getInfo());
});

module.exports = router;