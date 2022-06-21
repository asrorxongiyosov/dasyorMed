require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
 
const app = express();
console.log(process.env.API_KEY);
 
const port = process.env.PORT || 3001;
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/dasyormedDB",{useNewUrlParser: true});
const userSchema = new mongoose.Schema ({
    firstname: String,
    lastname: String,
    email: String,
    mobilenumber: String,
    bday: Date,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptionfield: ["password"]});

const User = new mongoose.model("User",userSchema);
 
const clientSchema = {
  client_firstname: String,
  client_lastname: String,
  client_mobileNumber: String,
  bday: Date
};
const Client = new mongoose.model("Client", clientSchema);

app.get('/', (req, res) => {
  res.render('home');
});

// Route for login
app.route("login")
.get((req, res) => {
  res.render('login');
})
.post((req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
      if(err){
          console.log(err);
      }else{
          if(foundUser){
              if(foundUser.password === password){
                  res.render("home");
              }
          }
      }
  });
});
 

app.get('/register', function(req, res) {
  res.render('register');
});
app.post("/register",function(req, res){
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.username,
    mobilenumber: req.body.mobilenumber,
    bday: req.body.bday,
    password: req.body.password
});
newUser.save(function(err){
if(err){
    console.log(err);
}else{
    res.render("home");
}
});
});
 
app.listen(port, () => console.log(`Server started at port: ${port}`)
);