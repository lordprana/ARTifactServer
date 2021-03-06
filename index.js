const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
// const session = require('express-session');
// const passport = require('passport');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
// const sessionStore = new SequelizeStore({db});
const PORT = process.env.PORT || 8080;
const app = express();
module.exports = app;

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('./secrets');

// passport registration
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) =>
//   db.models.user.findById(id)
//     .then(user => done(null, user))
//     .catch(done));

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'));

  // this route must be before body parsing middleware to take advantage of
  // streaming the request
  app.use('/api/identify-piece-from-plaque-image',
    require('./api/identify-piece-from-plaque-image'));

  // body parsing middleware
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

  // compression middleware
  app.use(compression());

  // session middleware with passport
  // app.use(session({
  //   secret: process.env.SESSION_SECRET || 'my best friend is Cody',
  //   store: sessionStore,
  //   resave: false,
  //   saveUninitialized: false
  // }));
  // app.use(passport.initialize());
  // app.use(passport.session());

  // api routes
  app.use('/api', require('./api'));
  app.use('/auth', require('./auth'));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));

};

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  db.sync({ force: false })
    .then(createApp)
    .then(startListening);
} else {
  createApp();
}
