const Sequelize = require('sequelize')
const db = require('../db')

const Post = db.define('post', {
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    subjectLine: {
        type: Sequelize.STRING,
        allowNull: true
    },
    content: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: true
        }
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
})


module.exports = Post