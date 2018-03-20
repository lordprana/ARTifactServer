const router = require('express').Router();
const { User, Post } = require('../db/models');
module.exports = router;


router.get('/me', (req, res, next) => {
    if (!req.auth) return res.sendStatus(401)
    User.findOne({
        where: {
            uuid: req.auth,
        }
    })
    .then(user => {
        if (user) res.send(user)
        else res.sendStatus(404)
    })
    .catch(next);
});

//GET ALL POSTS FOR INDIVIDUAL USER
router.get('/:facebookId/posts', (req, res, next) => {
    Post.findAll({
        where: {
            facebookId: req.params.facebookId
        }
    })
    .then(posts => res.json(posts))
    .catch(next);
});
