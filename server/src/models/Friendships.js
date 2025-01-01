module.exports = (sequelize, DataTypes) => {
  const Friendships = sequelize.define("Friendships", {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("accepted"),
      allowNull: false,
      defaultValue: "accepted",
    },
  });

  Friendships.associate = (models) => {
    Friendships.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "sender",
    });
    Friendships.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "receiver",
    });
  };

  return Friendships;
};
