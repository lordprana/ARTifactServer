const router = require('express').Router();
const { User, Post } = require('../db/models');
module.exports = router;


router.get('/:facebookId', (req, res, next) => {
    User.findOne({
        where: {
            facebookId: req.params.facebookId,
        }
    })
    .then(user => res.send(user))
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
