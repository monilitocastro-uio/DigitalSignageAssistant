const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const logger = require('./src/log/errorLog');
const { googleOAuthCallbackSignUp } = require('./src/services/auth/googleOAuthCallbackSignUp');
const { googleOAuthCallbackSignIn } = require('./src/services/auth/googleOAuthCallbackSignIn');

require('dotenv').config();

const app = express();

if(!process.env.APP_SECRET || 
    !process.env.GOOGLE_CLIENT_ID || 
    !process.env.GOOGLE_CLIENT_SECRET
) {
    console.error('Missing environment variables. Please check .env file');
    process.exit(1);
}

// Configure Session
app.use(session({ secret: process.env.APP_SECRET, resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// AUTH ROUTES START ****************************************************   

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL_SIGNUP
  },
  googleOAuthCallbackSignUp
));

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL_SIGNIN
  },
  googleOAuthCallbackSignIn
));

// Passport Serialize
passport.serializeUser((user, done) => {
    done(null, user);
});

// Passport Deserialize
passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(process.env.GOOGLE_CLIENT_CALLBACK_URL_SIGNUP, 
  passport.authenticate('google', { failureRedirect: '/error/signup' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


app.get(process.env.GOOGLE_CLIENT_CALLBACK_URL_SIGNIN, 
    passport.authenticate('google', { failureRedirect: '/error/signin' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// ****************************************************** Auth Routes End

// other routes
require('./routes');





app.listen(8181, () => {
  console.log('Server started on http://localhost:8181');
});
