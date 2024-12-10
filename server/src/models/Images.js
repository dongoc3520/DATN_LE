module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define("Images", {
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Images.associate = (models) => {
    // Users.hasMany(models.Likes, {
    //   onDelete: "cascade",
    // });
    Images.belongsTo(models.Posts, { foreignKey: "PostId", as: "post" });
  };

  return Images;
};
