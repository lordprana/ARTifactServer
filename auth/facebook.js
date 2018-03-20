const axios = require('axios')
const router = require('express').Router()
const { User } = require('../db/models')
module.exports = router

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {

  console.log('Facebook app ID / secret not found. Skipping Facebook OAuth.')

} else {

  router.get('/', (req, res, next) => {
    console.log('got to facebook auth')
    res.send('got to facebook auth')
  })

  router.post('/', (req, res, next) => {
    console.log('incoming token:', req.body.token)
    axios.get(`https://graph.facebook.com/me?fields=name,id,email,picture&access_token=${req.body.token}`)
    .then(result => result.data)
    .then(fbUser => {
      console.log('user from FB:', fbUser)
      User.find({
        where: { facebookId: fbUser.id }
      })
      .then(foundUser => {
        if (foundUser === null) {
          console.log('creating new user...')
          User.create({
            userName: fbUser.name,
            email: fbUser.email,
            facebookId: fbUser.id,
            facebookPic: fbUser.picture.data.url,
          })
          .then(newUser => {
            res.send(newUser)
            console.log('user sent back to client')
          })
          .catch(err => console.log(err))
        } else {
          console.log('found a user')
          res.send(foundUser)
          console.log('user sent back to client')
        }
      })
    })
    .catch(err => console.log(err))
  })
}
