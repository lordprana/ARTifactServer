const router = require('express').Router();
const { Post } = require('../db/models');
module.exports = router;


//GET ALL POSTS FOR INDIVIDUAL USER
router.get('/:userId/posts', (req, res, next) => {
    Post.findAll({
        where: {
            userId: req.params.userId
        }
    })
    .then(posts => res.json(posts))
    .catch(next);
});
