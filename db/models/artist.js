const Sequelize = require('sequelize');
const db = require('../db');

const Artist = db.define('artist', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nationality: {
      type: Sequelize.STRING
    },
    birthYear: {
        type: Sequelize.INTEGER
    },
    deathYear: {
        type: Sequelize.INTEGER
    }
});


module.exports = Artist;
