var express = require('express');
var router = express.Router();
var path=require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('signIn.html', {root:'./public' })
});

module.exports = router;