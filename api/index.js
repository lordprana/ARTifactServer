const router = require('express').Router();
module.exports = router;

router.use((req, res, next) => {
  req.auth = (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  ? req.headers.authorization.slice(7)
  : null;
  next();
});

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
