const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");
const ITEMS_PER_PAGE = 10;

/**
 * Handler function to wrap each route with. Reduces try.. catch blocks.
 * @param {function} cb
 * @returns callback
 */

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

/* GET catch all error route */
router.get("/error", (req, res, next) => {
  const err = new Error(`Error 500: Something went wrong.`);
  err.status = 500;
  throw err;
});

/* GET list of books */
router.get("/", asyncHandler(async (req, res) => {
    const search = req.query.search || "";
    const pageNum = req.query.page || 1;
    console.log(req.query.page)
    let books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { genre: { [Op.like]: `%${search}%` } },
          { year: { [Op.like]: `%${search}%` } },
        ]
      }
    });

    // Pagination
    const numberOfPages = Math.ceil(books.length / ITEMS_PER_PAGE);

    // If a page is selected, only return correct array segment
    req.query.page
      ? (books = books.slice(
          ((req.query.page * ITEMS_PER_PAGE) - ITEMS_PER_PAGE), (req.query.page * ITEMS_PER_PAGE)
      ))
      : (books = books.slice(0, ITEMS_PER_PAGE))

    res.render("books/index", { books, numberOfPages, pageNum, search, title: "Books" });
  })
);

/* Create a new book form */
router.get("/new-book", (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create a new book */
router.post("/", asyncHandler(async (req, res) => {
    let book;
    try {
      // create a new book object in the database
      book = await Book.create(req.body);
      // redirect to home
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("books/new-book", { book, errors: error.errors, title: "New Book" });
      } else {
        throw error;
      }
    }
  })
);

/* GET individual book */
router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/update-book", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      throw err;
    }
  })
);

/* POST to UPDATE a book */
router.post("/:id", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        // update the book object from the request body
        await book.update(req.body);
        // redirect to home
        res.redirect("/books");
      } else {
        const err = new Error();
        err.status = 404;
        throw err;
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        //book.id = req.params.id; //don't think is needed
        res.render("books/update-book", { book, errors: error.errors, title: "Update Book" });
      } else {
        throw error;
      }
    }
  })
);

/* POST to DELETE the individual book */
router.post("/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      const err = new Error();
      err.status = 404;
      throw err;
    }
  })
);

module.exports = router;