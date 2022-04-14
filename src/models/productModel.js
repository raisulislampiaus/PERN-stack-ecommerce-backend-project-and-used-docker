module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    name: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    brand: {
      type: DataTypes.TEXT,
    },
    category: { type: DataTypes.TEXT },
    countInStock: { type: DataTypes.INTEGER },
  });

  return Product;
};
