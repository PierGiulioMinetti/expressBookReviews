const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.user) {
    res.send(`Welcome, ${req.session.user}!`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.listen(PORT,()=>console.log("Server is running"));
