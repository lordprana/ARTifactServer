const router = require('express').Router()
const { Museum, Piece } = require('../db/models')
module.exports = router

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
    .then(id => {res.json(id)})
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

