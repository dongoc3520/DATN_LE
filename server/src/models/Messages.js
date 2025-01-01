module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define("Messages", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  Messages.associate = (models) => {
    Messages.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "userreceiver",
    });
    Messages.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "usersender",
    });
  };
  return Messages;
};
