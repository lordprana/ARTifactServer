const router = require('express').Router();
const { User } = require('../db/models');
module.exports = router;

router.use((req, res, next) => {
  req.auth = (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  ? req.headers.authorization.slice(7) : null;
  if (req.auth) {
    User.findOne({ where: { uuid: req.auth } })
    .then(user => {
      req.user = user;
      next();
    })
  } else {
    req.user = null;
    next();
  }
});

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/museums', require('./museums'));
router.use('/recommendations', require('./recommendations'));
router.use('/style-image', require('./style-image'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
