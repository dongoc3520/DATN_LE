const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    UserId: DataTypes.INTEGER,
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Posts.associate = (models) => {
    // Posts.hasMany(models.Comments, {
    //   onDelete: "cascade",
    // });
    Posts.belongsTo(models.Users, { foreignKey: "UserId", as: "user" });
    // Posts.hasMany(models.Likes, {
    //   onDelete: "cascade",
    // });
  };
  sequelizePaginate.paginate(Posts);

  return Posts;
};
