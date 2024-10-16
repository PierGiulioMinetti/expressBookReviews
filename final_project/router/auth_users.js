const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')


const secretKey = "your-secret-key"; // Replace with a strong secret key

let users = [
	// {
	// 	username: "Giulio",
	// 	password: 1234,
	// },
	// {
	// 	username: "Luigi",
	// 	password: 5678,
	// },
];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	const isPresent = users.find((user) => user.username === username);
	return isPresent ? false : true;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let userMatch = users.filter((user) => {
		return user.username == username && user.password == password;
	});
	return userMatch.length > 0 ? true : false;
};

// @POST - localhost:5000/customer/register
// Route to handle user registration
regd_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	// -validate user existence already
	if (isValid(username)) {
    users.push({username, password})
		res.status(200).send("New user created");
	} else {
		res.status(403).send("Name already exist!");
	}
});

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	// --check if the user exist
	const isUserAuthorized = authenticatedUser(username, password);
	console.log('------------------------------------------------------------');
	console.log(users);
	console.log('------------------------------------------------------------');

	if (isUserAuthorized) {
		// create JWT
		const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    //create session
    req.session.user = username;
		res.status(200).json({ token }); // Send token as JSON response
	} else {
		res.status(403).json({ message: "Invalid credentials!" }); // Send token as JSON response
	}

	//Write your code here
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
