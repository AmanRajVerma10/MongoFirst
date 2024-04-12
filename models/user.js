const mongodb = require("mongodb");
const { get } = require("../routes/admin");

const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    let db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  addToCart(product) {
    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }
  static findById(userId) {
    return getDb()
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

module.exports = User;
