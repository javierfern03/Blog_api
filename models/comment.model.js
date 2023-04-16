const { db } = require('../database/config');
const { DataTypes } = require('sequelize');

const Comment = db.define('comment', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  Text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'desabled'),
    defaultValue: 'active',
  },
});

module.exports = Comment;
