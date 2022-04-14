const { Sequelize, DataTypes } = require("sequelize");
const CONNECTION_STRING =
  process.env.DATABASE || "postgres://postgres:piaus123@localhost:5432/full-33";
const sequelize = new Sequelize(CONNECTION_STRING);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("../models/productModel")(sequelize, DataTypes);
db.reviews = require("../models/reviewModel")(sequelize, DataTypes);
db.users = require("../models/userModel")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

db.products.hasMany(db.reviews, {
  foreignKey: "product_id",
  as: "review",
});

db.reviews.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product",
});

module.exports = db;
