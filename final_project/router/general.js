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

	if((username === undefined || username === null) || (password === undefined || password === null)){
		res.status(403).send('Provide username and password to register!')
	}

	if (username && password) {
		if(isValid(username)){
			console.log('________________________________________________________________');
			console.log('Original list of users', users);
			users.push({ username, password });
			console.log('________________________________________________________________');
			console.log('New list of users', users);
			console.log('________________________________________________________________');

			res.send('You have been registered as a new user!');
		} else {
			res.status(403).send('User already exist!');
		}
		console.log(username, password);
	}
  });

//   @GET - original get call for unauthenticated users
// Get the book list available in the shop
public_users.get("/", function (req, res) {
	res.json({ books: books });
});

public_users.get("/", async (req, res) => {
	try {
	  // Making an HTTP GET request to the external endpoint
	  const response = await axios.get("http://localhost:5000/");
	  
	  const booksData = response.data; 
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
// 	console.log(filteredBooks);
// 	if (filteredBooks) {
// 		res.status(200).json(filteredBooks);
// 	} else {
// 		res.status(404).json({ books: "No books found!" });
// 	}
// });

public_users.get("/isbn/:isbn", async (req, res) => {
	const isbn = req.params.isbn;
  
	try {
	  // Making an HTTP GET request to fetch all books
	  const response = await axios.get("http://localhost:5000/");
	  const allBooks = response.data; 
  
	  // Convert the object to an array and filter by ISBN
	  const books = Object.values(allBooks);
	  const booksArray = books[0];
	  const filteredBooks = Object.values(booksArray).filter(book => book.ISBN === isbn);
	  
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



// Get book details based on author
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

public_users.get("/author/:author", async (req, res) => {
	const author = req.params.author;
  
	try {
	  // Making an HTTP GET request to fetch books and then filter
	  const response = await axios.get(`http://localhost:5000/`);
	  const allBooks = response.data;
	    // Convert the object to an array and filter by ISBN
		const books = Object.values(allBooks);
		const booksArray = books[0];
		const filteredBooks = Object.values(booksArray).filter(book => book.author === author);
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

  public_users.get("/title/:title", async (req, res) => {
	const title = req.params.title;
  
	try {
	  // Making an HTTP GET request to fetch books and then filter
	  const response = await axios.get(`http://localhost:5000/`);
	  const allBooks = response.data;
	    // Convert the object to an array and filter by ISBN
		const books = Object.values(allBooks);
		const booksArray = books[0];
		const filteredBooks = Object.values(booksArray).filter(book => book.title === title);
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

function filterBooksByPropertyDataSet(dataset, value, property) {
	return Object.values(dataset).filter((book) => book[property] === value);
}

module.exports.general = public_users;
