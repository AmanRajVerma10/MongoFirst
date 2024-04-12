const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class User {
  // constructor(name, email, cart, id) {
  //   this.name = name;
  //   this.email = email;
  //   this.cart = cart;
  //   this._id = id;
  // }
  constructor(name, email, cart = { items: [] }, id) {
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
    console.log("heyyyy",this.cart)
    const cartProductIndex = this.cart.items.findIndex((p) => {
      return p.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {items: updatedCartItems};
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  // addToCart(product) {
  //   const cartProductIndex = this.cart.items.findIndex(cp => {
  //     return cp.productId.toString() === product._id.toString();
  //   });
  //   let newQuantity = 1;
  //   const updatedCartItems = [...this.cart.items];

  //   if (cartProductIndex >= 0) {
  //     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  //     updatedCartItems[cartProductIndex].quantity = newQuantity;
  //   } else {
  //     updatedCartItems.push({
  //       productId: new ObjectId(product._id),
  //       quantity: newQuantity
  //     });
  //   }
  //   const updatedCart = {
  //     items: updatedCartItems
  //   };
  //   const db = getDb();
  //   return db
  //     .collection('users')
  //     .updateOne(
  //       { _id: new ObjectId(this._id) },
  //       { $set: { cart: updatedCart } }
  //     );
  // }

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
