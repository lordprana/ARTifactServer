const Sequelize = require('sequelize');
const db = require('../db');

const Post = db.define('post', {
    subjectLine: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
});


module.exports = Post;
