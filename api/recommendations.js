const router = require('express').Router();
let ug = require('ug');
const { User, Piece } = require('../db/models');
module.exports = router;

router.get('/', (req, res, next) => {
  // To start, construct the full graph for every request.
  // Eventually we will move this to a cron job and simply load the
  // graph into memory
  let graph = new ug.Graph();

  let usersQuery = User.findAll({
    include:
      [
        {
          model: Piece,
          as: 'FavoritePieces'
        }
      ]
  });


  let currentUserNode;
  let addedPieces = {};
  usersQuery
  .then((users) => {
    // Construct graph
    users.forEach(user => {
      let userNode = graph.createNode('user', user);
      if (user.id === req.user.id) {
        currentUserNode = userNode;
      }

      user.FavoritePieces.forEach(piece => {
        let pieceNode;
        if (addedPieces[piece.id]) {
          pieceNode = addedPieces[piece.id];
        } else {
          pieceNode = graph.createNode('piece', piece);
          addedPieces[piece.id] = pieceNode;
        }

        graph.createEdge('favorite').link(
          userNode,
          pieceNode
        ).setDistance(1);
      });
    });

    // get the closest nodes for recommendation
    // minDepth of 2 to prevent recommending something the user already
    // likes.
    let results = graph.closest(currentUserNode, {
      compare: function(node) { return node.entity === 'piece'; },
      minDepth: 2,
      count: 10
    });

    // convert the results, which come as paths, to the end of the path
    // which will give the entity for recommendation
    let resultNodes = results.map(function(path) {
      let value = path.end().properties.dataValues;
      return value;
    });

    res.json(resultNodes);
  });

});
