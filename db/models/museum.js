const Sequelize = require('sequelize')
const db = require('../db')

const Museum = db.define('museum', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false
    },
})


module.exports = Museum
