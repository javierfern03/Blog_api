const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const PostImg = db.define('postImg', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  postImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'desabled'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = PostImg;
