const Sequelize = require('sequelize');
const db = require('../db');


const User = db.define('user', {
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    }

});


module.exports = User;
