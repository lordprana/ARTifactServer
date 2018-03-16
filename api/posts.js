const router = require('express').Router()
const {Post} = require('../db/models')


//GET ALL POSTS FOR HOME PAGE
router.get('/posts', (req, res, next) => {
    Post.findAll()
    .then(posts => res.json(posts))
    .catch(next)
})

router.get('/posts/:postId', (req, res, next) => {
    Post.findAll()
    .then(post => res.json(post))
    .catch(next)
})

router.post('/posts', (req, res, next) => {
    Post.create(req.body)
    .then(newPost => res.json(newPost))
    .catch(next)
})

router.put('/posts/:postId', (req, res, next) => {
    const id = req.params.postId
    Post.update(req.body, {
        where: {id},
        returning: true
    })
    .then(([rowsUpdate, [newPost]]) =>
        res.json(newPost)
    ).catch(next)
})

router.delete('/:postId', (req, res, next) => {
    const id = req.params.postId
    Post.destroy({
        where: {id}
    })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router
