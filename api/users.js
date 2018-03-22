const router = require('express').Router();
const { User, Post } = require('../db/models');
module.exports = router;


router.get('/me', (req, res, next) => {
    if (!req.auth) return res.sendStatus(401)
    if (!req.user) return res.sendStatus(404)
    return res.json(req.user)
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
