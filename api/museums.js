const router = require('express').Router();
const { Museum, Piece, Post } = require('../db/models');
module.exports = router;

router.get('/location', (req, res, next) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  Museum.findAll({})
    .then(result => {
      return result.map((museum) => {
        return {
          id: museum.id,
          distance: Math.sqrt(Math.pow((museum.latitude - latitude), 2) + Math.pow((museum.longitude - longitude), 2))
        }
      }).sort((a, b) => { return (a.distance - b.distance) })[0].id
    })
    .then(id => {
      Museum.findById(id, {
        include: [
          { model: Piece }
        ]
      })
        .then(museum => {
          res.json(museum)
        })
    })
    .catch(next)
})

router.get('/:museumId', (req, res, next) => {
  Museum.findById(req.params.museumId, {
    include: [
      { model: Piece }
    ]
  })
    .then(museum => {
      res.json(museum)
    })
    .catch(next)
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
