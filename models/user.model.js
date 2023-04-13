const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const User = db.define('users', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangeAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  profileImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:
      'https://thumbs.dreamstime.com/b/vector-de-perfil-avatar-predeterminado-imagen-s%C3%ADmbolo-usuario-medios-sociales-icono-209498286.jpg',
  },
  status: {
    type: DataTypes.ENUM('active', 'desabled'),
    defaultValue: 'active',
    allowNull: false,
  },
});

module.exports = User;
