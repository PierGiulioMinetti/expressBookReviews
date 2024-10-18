const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Route to handle user registration
public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (
		username === undefined ||
		username === null ||
		password === undefined ||
		password === null
	) {
		res.status(403).send("Provide username and password to register!");
	}

	if (username && password) {
		if (isValid(username)) {
			console.log("Original list of users", users);
			users.push({ username, password });
			res.status(200).json({message: "You have been successfully registered", users});
		} else {
			res.status(403).send("User already exist!");
		}
		console.log(username, password);
	}
});

//   @GET - original get call for unauthenticated users
// Get the book list available in the shop
// public_users.get("/", function (req, res) {
// 	res.json({ books: books });
// });

// @GET - endpoint created to return books
public_users.get("/books", function (req, res) {
	res.json({ books: books });
});

// @GET - async get to get all books
public_users.get("/", async (req, res) => {
	try {
		// Making an HTTP GET request to the external endpoint
		const { data: booksData } = await axios.get("http://localhost:5000/books");

		// Sending the fetched data as JSON response
		res.json({ books: booksData });
	} catch (error) {
		console.error("Error fetching books:", error);
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
// 	const isbn = req.params.isbn;
// 	let filteredBooks;
// 	filteredBooks = filterBooksByProperty(isbn, 'ISBN');

// 	if (filteredBooks) {
// 		res.status(200).json(filteredBooks);
// 	} else {
// 		res.status(404).json({ books: "No books found!" });
// 	}
// });

// @GET - async get all books by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
	const isbn = req.params.isbn;

	try {
		// Making an HTTP GET request to fetch all books
		const response = await axios.get("http://localhost:5000/");
		const allBooks = response.data.books.books;

		const booksArray = [];
		// convert the object in array of objects
		Object.keys(allBooks).forEach((key) => {
			booksArray.push(allBooks[key]);
		});
		const filteredBooks = booksArray.filter(
			(book) => book.ISBN === isbn
		);

		if (filteredBooks.length > 0) {
			res.status(200).json(filteredBooks);
		} else {
			res.status(404).json({ books: "No books found!" });
		}
	} catch (error) {
		console.error("Error fetching books:", error);
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

// @Get - get book details based on author
// public_users.get("/author/:author", function (req, res) {
// 	const author = req.params.author;
// 	let filteredBooks;

// 	filteredBooks = filterBooksByProperty(author, 'author');
// 	console.log(filteredBooks);
// 	if (filteredBooks) {
// 		res.status(200).json(filteredBooks);
// 	} else {
// 		res.status(404).json({ books: "No books found!" });
// 	}
// });

// @GET - async get all books by author
public_users.get("/author/:author", async (req, res) => {
	const author = req.params.author;

	try {
		// Making an HTTP GET request to fetch books and then filter
		const response = await axios.get(`http://localhost:5000/`);
		const allBooks = response.data.books.books;

		const booksArray = [];
		// convert the object in array of objects
		Object.keys(allBooks).forEach((key) => {
			booksArray.push(allBooks[key]);
		});
		const filteredBooks = booksArray.filter(
			(book) => book.author === author
		);
		if (filteredBooks.length > 0) {
			res.status(200).json(filteredBooks);
		} else {
			res.status(404).json({ books: "No books found!" });
		}
	} catch (error) {
		console.error("Error fetching books:", error);
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
// 	let filteredBooks;

// 	filteredBooks = filterBooksByProperty(title, 'title');
//   if (filteredBooks) {
// 		res.status(200).json(filteredBooks);
// 	} else {
// 		res.status(404).json({ books: "No books found!" });
// 	}
// });

// @GET - async get all books by title
  public_users.get("/title/:title", async (req, res) => {
	const title = req.params.title;

	try {
	  // Making an HTTP GET request to fetch books and then filter
	  const response = await axios.get(`http://localhost:5000/`);
	  const allBooks = response.data.books.books;

	  const booksArray = [];
	  // convert the object in array of objects
	  Object.keys(allBooks).forEach((key) => {
		  booksArray.push(allBooks[key]);
	  });
	  const filteredBooks = booksArray.filter(
		  (book) => book.title === title
	  );
	  if (filteredBooks.length > 0) {
		res.status(200).json(filteredBooks);
	  } else {
		res.status(404).json({ books: "No books found!" });
	  }
	} catch (error) {
	  console.error("Error fetching books:", error);
	  res.status(500).json({ error: "Failed to fetch books" });
	}
  });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	let filteredBooks;

	filteredBooks = filterBooksByProperty(isbn, "ISBN");
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

function filterBooksByPropertyDataSet(dataset, value, property) {
	return Object.values(dataset).filter((book) => book[property] === value);
}

module.exports.general = public_users;
