const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../app/models/user');


module.exports = (passport)=>{
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
      },
        (email, password, done)=> {
          User.findOne({ 'local.email': email },  (err, user)=> {
            if (err) { return done(err); }
            if (!user) { return done(null, false,{message:'no user found'}); }
            console.log(password);
            console.log(user.local.password);
            bcrypt.compare(password,user.local.password,(err,isMatch)=>{
              console.log(isMatch);
              if(err)throw err;
              if(isMatch){
                console.log('logged in');
                return done(null,user);
              }
              else{
                return done(null, false,{message:'wrong password'});
              }
            })
          });
        }
      ));

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
