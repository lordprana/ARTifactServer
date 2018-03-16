const router = require('express').Router()


//GET ALL POSTS FOR INDIVIDUAL USER
router.get('/users/:userId/posts', (req, res, next) => {
    const id = req.params.categoryId
    Post.findById(id)
        .then(category => res.json(category))
        .catch(next)
})
