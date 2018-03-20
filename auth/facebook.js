const axios = require('axios')
const router = require('express').Router()
const { User } = require('../db/models')
module.exports = router

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {

  console.log('Facebook app ID / secret not found. Skipping Facebook OAuth.')

} else {

  router.post('/', (req, res, next) => {
    axios.get(`https://graph.facebook.com/me?fields=name,id,email,picture&access_token=${req.body.token}`)
      .then(result => result.data)
      .then(fbUser => {
        User.find({
          where: { facebookId: fbUser.id }
        })
          .then(foundUser => {
            if (foundUser === null) {
              User.create({
                userName: fbUser.name,
                email: fbUser.email,
                facebookId: fbUser.id,
                facebookPicUrl: fbUser.picture.data.url,
              })
                .then(newUser => {
                  res.send(newUser)
                })
            } else {
              res.send(foundUser)
            }
          })
          .catch(next)
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(401)
      })
  })
}
