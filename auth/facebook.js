const axios = require('axios')
const router = require('express').Router()
const { User } = require('../db/models')
module.exports = router

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {

  console.log('Facebook app ID / secret not found. Skipping Facebook OAuth.')

} else {
// change to findOrCreate
  router.post('/', (req, res, next) => {
    axios.get(`https://graph.facebook.com/me?fields=name,id,email,picture&access_token=${req.body.token}`)
      .then(result => result.data)
      .then(fbUser =>
        User.findOrCreate({
          where: { facebookId: fbUser.id },
          defaults: {
            userName: fbUser.name,
            email: fbUser.email,
            facebookId: fbUser.id,
            facebookPicUrl: fbUser.picture.data.url,
          }
        })
        .then(([user, wasCreated]) => {
          console.log((wasCreated ? 'created' : 'found') + ' user with Facebook ID', user.facebookId)
          res.send(user)
        })
        .catch(next)
      )
      .catch(err => {
        err.status = 401
        next(err)
      })
  })
}
