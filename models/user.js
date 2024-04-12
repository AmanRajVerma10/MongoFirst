const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
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
  findUserById(userId) {
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
