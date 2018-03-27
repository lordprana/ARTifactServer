const Sequelize = require('sequelize');
const db = require('../db');

const Piece = db.define('piece', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.TEXT
    },
    pictureUrl: {
      type: Sequelize.STRING,
      validate: {
        isUrl: true
      }
    }
});


module.exports = Piece;
