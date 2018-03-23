const router = require('express').Router()
const { Museum, Piece } = require('../db/models')

router.get('/location', (req, res, next) => {
  //send coords in query string
  res.sendStatus(204)
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
