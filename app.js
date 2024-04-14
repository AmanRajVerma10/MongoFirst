const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');

const errorController = require('./controllers/error');
const User= require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('66192723c218ab6e557be54d')
    .then(user => {
      req.user = new User(user.name,user.email,user.cart,user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect("mongodb+srv://Aman10:Gw8e9cffhVHQwKA2@cluster0.zkcwrac.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
  app.listen(3000);
  console.log("Mongoose Connection Made!")
})
.catch(e=>{
  console.log(e);
})