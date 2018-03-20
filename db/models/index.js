const User = require('./user');
const Post = require('./post');
const Piece = require('./piece');
const Artist = require('./artist');

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

Post.belongsTo(User, { foreignKey: { allowNull: false } });

Piece.belongsTo(Artist, { foreignKey: { allowNull: false } });
Artist.hasMany(Piece);

User.belongsToMany(Piece, { as: 'FavoritePieces', through: 'UserPiece' });
Piece.belongsToMany(User, { through: 'UserPiece' });

module.exports = {
  User,
  Post,
  Piece,
  Artist
};
