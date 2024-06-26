const mongoose = require("mongoose");
const product = require("./product");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart=function(product){
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
            productId: product._id,
            quantity: newQuantity,
          });
        }
        const updatedCart = { items: updatedCartItems };
        this.cart=updatedCart;
        return this.save();
}
userSchema.methods.delete=function(prodId){
  const updatedCartItems= this.cart.items.filter(i=>{
    return i.productId.toString()!==prodId.toString()
  })
  const updatedCart= {items: updatedCartItems}
  this.cart= updatedCart;
  return this.save();
}

userSchema.methods.clearCart=function(){
  this.cart={items:[]};
  return this.save();
}

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");

// const getDb = require("../util/database").getDb;

// class User {
//   constructor(name, email, cart = { items: [] }, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     let db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }
//   getCart() {
//     let db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((p) => {
//       return p.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   delete(prodId) {
//     let db = getDb();
//     const itemIndex = this.cart.items.findIndex(
//       (item) => item._productId == prodId
//     );
//     let updatedCart = [...this.cart.items];
//     updatedCart.splice(itemIndex, 1);
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCart } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: { _id: new mongodb.ObjectId(this._id), name: this.name },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }
//   getOrders() {
//     return getDb()
//       .collection("orders")
//       .find({'user._id': new mongodb.ObjectId(this._id) }).toArray()
//   }

//   static findById(userId) {
//     return getDb()
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((res) => {
//         console.log(res);
//         return res;
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }
// }

// module.exports = User;
