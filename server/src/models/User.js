module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://cdn-icons-png.flaticon.com/512/6681/6681221.png",
    },
    work: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Users.associate = (models) => {
    // Users.hasMany(models.Likes, {
    //   onDelete: "cascade",
    // });
    // Users.hasMany(models.Comments, {
    //   onDelete: "cascade",
    // });
  };

  return Users;
};
