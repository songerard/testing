'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply, { foreignKey: 'UserId' })
    User.hasMany(models.Tweet, { foreignKey: 'UserId' })
    User.hasMany(models.Like, { foreignKey: 'UserId' })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  };
  return User;
};