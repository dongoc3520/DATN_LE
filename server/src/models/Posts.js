const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    UserId: DataTypes.INTEGER,
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    District: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Images, {
      foreignKey: "PostId",
      onDelete: "CASCADE",
    });
    Posts.belongsTo(models.Users, { foreignKey: "UserId", as: "user" });
    Posts.hasMany(models.Interests, {
      foreignKey: "PostId",
      onDelete: "CASCADE",
    });
  };
  sequelizePaginate.paginate(Posts);

  return Posts;
};
