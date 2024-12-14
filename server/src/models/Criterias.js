const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Criterias = sequelize.define("Criterias", {
    UserId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Criterias.associate = (models) => {
    // Posts.hasMany(models.Images, {
    //   onDelete: "cascade",
    // });
    // Posts.belongsTo(models.Users, { foreignKey: "UserId", as: "user" });
    // Posts.hasMany(models.Interests, {
    //   onDelete: "cascade",
    // });
    Criterias.belongsTo(models.Users, { foreignKey: "UserId", as: "user" });
  };
  // sequelizePaginate.paginate(Posts);

  return Criterias;
};
