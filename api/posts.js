const router = require('express').Router();
const {Post} = require('../db/models');


//GET ALL POSTS FOR HOME PAGE
router.get('/', (req, res, next) => {
    Post.findAll()
    .then(posts => res.json(posts))
    .catch(next);
});

router.get('/:postId', (req, res, next) => {
    Post.findById(req.params.postId)
    .then(post => {
        if (post) res.json(post);
        else res.sendStatus(404);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
    Post.create(req.body)
    .then(newPost => res.json(newPost))
    .catch(next);
});

router.put('/:postId', (req, res, next) => {
    const id = req.params.postId;
    Post.update(req.body, {
        where: {id},
        returning: true
    })
    .then(([rowsUpdate, [newPost]]) => {
        if (newPost) res.json(newPost);
        else res.sendStatus(404);
    })
    .catch(next);
});

router.delete('/:postId', (req, res, next) => {
    const id = req.params.postId;
    Post.destroy({
        where: {id}
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
