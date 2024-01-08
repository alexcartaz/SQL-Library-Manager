"use strict";

/**
 * Define a database model to be exported, with tables names, data types, and validation
 *
 * @param {promise-based ORM (object relational mapping) tool} sequelize
 * @param {Define type of data for sequelize} DataTypes
 * @returns table named Book to store data
 */

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Please provide a value for title",
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Please provide a value for author",
          },
        },
      },
      genre: DataTypes.STRING,
      year: DataTypes.INTEGER,
    },
    {}
  ); 

  return Book;
};