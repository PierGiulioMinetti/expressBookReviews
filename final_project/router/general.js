const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	//Write your code here
	return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	res.json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	let filteredBooks;

	filteredBooks = filterBooksByProperty(isbn, 'ISBN');
	console.log(filteredBooks);
	if (filteredBooks) {
		res.status(200).json(filteredBooks);
	} else {
		res.status(404).json({ books: "No books found!" });
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;
	let filteredBooks;

	filteredBooks = filterBooksByProperty(author, 'author');
	console.log(filteredBooks);
	if (filteredBooks) {
		res.status(200).json(filteredBooks);
	} else {
		res.status(404).json({ books: "No books found!" });
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
	let filteredBooks;

	filteredBooks = filterBooksByProperty(title, 'title');
  if (filteredBooks) {
		res.status(200).json(filteredBooks);
	} else {
		res.status(404).json({ books: "No books found!" });
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	let filteredBooks;

	filteredBooks = filterBooksByProperty(isbn, 'ISBN');
  const reviews = filteredBooks[0].reviews;
	if (filteredBooks) {
		res.status(200).json(reviews);
	} else {
		res.status(404).json({ books: "No reviews found!" });
	}
});

function filterBooksByProperty(value, property) {
	return Object.values(books).filter((book) => book[property] === value);
}

module.exports.general = public_users;
