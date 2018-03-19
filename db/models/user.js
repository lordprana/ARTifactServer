/* eslint-disable no-bitwise */

const Sequelize = require('sequelize');
const db = require('../db');

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

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
    },
    facebookId: {
        type: Sequelize.STRING,
        unique: true,

    },
    facebookPic: {
        type: Sequelize.STRING
    },
    uuid: {
        type: Sequelize.STRING,
        unique: true,
    }
},
{
    hooks: {
        beforeCreate: user => {
            user.uuid = uuidv4();
        }
    }
});


module.exports = User;
