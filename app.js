const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById('661cea14ed38743de8756af0')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Aman10:Gw8e9cffhVHQwKA2@cluster0.zkcwrac.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    User.findOne().then(user=>{
      if(!user){
        const user = new User({
          name: "Aman",
          email: "test@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    })
    app.listen(3000);
    console.log("Mongoose Connection Made!");
  })
  .catch((e) => {
    console.log(e);
  });
