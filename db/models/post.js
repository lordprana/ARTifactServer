const Sequelize = require('sequelize');
const db = require('../db');

const Post = db.define('post', {
    subjectLine: {
        type: Sequelize.STRING,
        allowNull: true
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
Post.beforeCreate((post, options) => {
        if(post.parentId !== null){
            post.setDataValue('subjectLine', null)
        }
    }
)

module.exports = Post;
