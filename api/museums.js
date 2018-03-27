const router = require('express').Router();
const { Museum, Piece, Post } = require('../db/models');
module.exports = router;

router.get('/location', (req, res, next) => {
  //send coords in query string
  res.sendStatus(204);
});

router.get('/:museumId', (req, res, next) => {
  Museum.findById(req.params.museumId, {
    include: [
      { model: Piece }
    ]
  })
  .then(museum => {
    res.json(museum);
  })
  .catch(next);
});

router.get('/:museumId/pieces', (req, res, next) => {
  Piece.findAll(
    {
      where: { museumId: req.params.museumId },
      include: [{ model: Post }]
    }
  ).then(pieces => {
    pieces.forEach((piece) => {
      piece.totalVotes = 0;
      piece.posts.forEach((post) => {
        piece.totalVotes += post.votes;
      });
    });
    let topPieces = [];
    let sortedPieces = pieces.sort(function (a, b) {
      return b.totalVotes - a.totalVotes;
    });
    topPieces = sortedPieces.slice(0, 5);
    return topPieces;
  }).then(topPieces => {

    res.json(topPieces);
  })
    .catch(next);
});
