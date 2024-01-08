var express = require('express');
var router = express.Router();
let Book = require('../models').Book;

// handler function to wrap each route
function asyncHandler(cb){
  return async(req, res, next) => {
    try{
      await cb(req, res, next)
    } catch(error){
      next(error)
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req,res) => {
  let books = await Book.findAll();
  res.redirect("/books");
}));

module.exports = router;
