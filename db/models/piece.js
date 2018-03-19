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
    }
});


module.exports = Piece;
