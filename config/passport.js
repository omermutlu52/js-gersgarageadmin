const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Admin model
const Admin = require('../models/admin');



module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ username: 'username' }, (username, password, done) => {
      // Match user
      Admin.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That user is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
      done(err, user);
    });
  });
};




