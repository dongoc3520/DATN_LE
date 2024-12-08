module.exports = (sequelize, DataTypes) => {
  const Interests = sequelize.define("Interests", {
    PostId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Interests.associate = (models) => {
    Interests.belongsTo(models.Posts, { foreignKey: "PostId", as: "post" });
  };

  return Interests;
};
