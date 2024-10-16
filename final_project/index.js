const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());
app.use(session({
  secret: 'secret-key',      // Replace with a strong secret key
  resave: false,             // Whether to save the session data if there were no modifications
  saveUninitialized: true,   // Whether to save new but not modified sessions
  cookie: { secure: false }  // Set to true in production with HTTPS
}));


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// --jwt ?

// session
const user = req.session.user;
if (user) {
    res.send(`Welcome, ${req.session.user}!`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.listen(PORT,()=>console.log("Server is running"));
