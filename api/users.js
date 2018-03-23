const router = require('express').Router();
const { User, Post } = require('../db/models');
module.exports = router;


router.get('/me', (req, res, next) => {
    if (!req.auth) return res.sendStatus(401)
    if (!req.user) return res.sendStatus(404)
    req.user.getFavoritePieces()
    .then(pieces => {
        req.user.dataValues.pieces = pieces
        res.json(req.user)
    })
    .catch(next)
});

// router.get('/my-pieces', (req, res, next) => {
//     if (!req.auth) return res.sendStatus(401)
//     if (!req.user) return res.sendStatus(404)
//     req.user.getFavoritePieces()
//     .then(pieces => {
//         res.json(pieces)
//     })
//     .catch(next)
// });

router.post('/add-piece', (req, res, next) => {
    if (!req.auth) return res.sendStatus(401)
    if (!req.user) return res.sendStatus(404)
    req.user.addFavoritePiece(req.body.piece.id)
    .then(piece => {
        console.log(piece)
        res.json(piece)
    })
})
