const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const logger = require('./src/log/errorLog');
const { googleOAuthCallbackSignIn } = require('./src/services/auth/googleOAuthCallbackSignIn');
const path = require('path');

require('dotenv').config();

const app = express();
 
if(
    !process.env.APP_SECRET || 
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

// ejs init
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// AUTH ROUTES START ****************************************************   


// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL
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


app.get(process.env.GOOGLE_CLIENT_CALLBACK_URL, 
    passport.authenticate('google', { failureRedirect: '/error/signin' }),
    (req, res, next) => {
      // Successful authentication, redirect home. 
      res.redirect('/');
      next();
    }
);
  
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
// ****************************************************** Auth Routes End


// // other routes
// app.use("/", require('./src/routes/index'));

// the web app
// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '../DigitalSignAssistant/dist')));

// For all other routes, serve the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../DigitalSignAssistant/dist', 'index.html'));
});


app.listen(8181, () => {
  console.log('Server started on http://localhost:8181');
});
