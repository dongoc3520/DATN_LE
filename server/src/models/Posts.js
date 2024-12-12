const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    UserId: DataTypes.INTEGER,
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Images, {
      onDelete: "cascade",
    });
    Posts.belongsTo(models.Users, { foreignKey: "UserId", as: "user" });
    Posts.hasMany(models.Interests, {
      onDelete: "cascade",
    });
  };
  sequelizePaginate.paginate(Posts);

  return Posts;
};
