const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')


const secretKey = "your-secret-key"; // Replace with a strong secret key

let users = [
];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	const isPresent = users.find((user) => user.username === username);
	return isPresent ? false : true;
};


// @POST - localhost:5000/customer/register
// Route to handle user registration
regd_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	// -validate user existence already
	if (isValid(username)) {
		users.push({username, password});
		res.status(200).json({message: "You have been succesfully registered!",users});
	} else {
		res.status(403).send("Name already exist!");
	}
});

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let userMatch = users.filter((user) => {
		return user.username == username && user.password == password;
	});
	return userMatch.length > 0 ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;
	// --check if the user exist
	const isUserAuthorized = authenticatedUser(username, password);

	if (isUserAuthorized) {
		// create JWT
		const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    //create session
    req.session.user = username;
		res.status(200).json({ token }); // Send token as JSON response
	} else {
		res.status(403).json({ message: "Invalid credentials!" }); // Send token as JSON response
	}
});

// "reviews": [{author:'', text:''}]

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const reviewText = req.body.reviewText;
	const user = req.session.user;

	console.log(isbn, reviewText, user);

	if (user) {
	  console.log('Authenticated. Proceeding with review.');
	//   -insert review based on customer name
	console.log('books BEFORE instert review');
	insertReviewByISBN(isbn, user, reviewText);
	console.log('books AFTER insert review');
	//   -update review based on customer name
	//   -insert new review based on customer name

	  return res.status(200).json({books});
	} else {
	  return res.status(401).send('Unauthorized. Please log in.');
	}
  });

  function insertReviewByISBN(isbn, author, text) {
	const book = Object.values(books).find(book => book.ISBN === isbn);
	if (book) {
	  const existingReview = book.reviews.find(review => review.author === author);
	  if (existingReview) {
		// Update existing review
		existingReview.text = text;
	} else {
		// Create new review
		const newReview = { author, text };
		book.reviews.push(newReview);
	  }
	} else {
	  console.error(`Book with ISBN ${isbn} not found.`);
	}
}

  function deleteReviewByISBN(isbn, author) {
	const book = Object.values(books).find(book => book.ISBN === isbn);
	if (book) {
		 book.reviews = book.reviews.filter(review => review.author !== author);
		return book;
	} else {
	  console.error(`Book with ISBN ${isbn} not found.`);
	}
}

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const user = req.session.user;

	if(user){
		const filteredBooks = deleteReviewByISBN(isbn, user)
		res.status(200).json({filteredBooks});
	} else {
		res.status(401).json({error: 'Login first! User not authorized!'});
	}

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
