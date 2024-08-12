import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import logger from './src/log/errorLog.js';
import { googleOAuthCallbackSignIn } from './src/services/auth/googleOAuthCallbackSignIn.js';
import path, { dirname } from 'path';
import httpProxy from 'express-http-proxy'; 
import { securedRoute } from './src/services/auth/secureRoute.js';
import multer from 'multer';
import fs from 'fs'; 
import { User } from './src/models/user/index.js';
import indexRouter from './src/routes/index.js'; // Ensure you have the .js extension


import { config } from 'dotenv';
import { VectorEmbedService } from './src/services/embeddings/index.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

var docCache = {}

var chatCache = {};


// Set up Multer storage with dynamic destination based on user email
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userEmail = req?.user?.email;
    if(!userEmail)
    {
      cb("User email not defined.", null);
      return;
    }
    const userDir = `./data/uploads/${userEmail}`;

    // Ensure the directory exists
    fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(
      null, 
      file.originalname
    );
  },
});
const upload = multer({ storage: storage });

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

app.get("/error/signin", (req,res)=>{
  
  return res.status(401).render('error/signin', { title: 'Sign In Error' }); 
})



// Passport Serialize
passport.serializeUser((user, done) => {
    done(null, user.providerId);
});

// Passport Deserialize
passport.deserializeUser((providerId, done) => {
    var user = User.findOneByGoogleId(providerId);
    done(null, user);
});
 
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get("/secure-test", securedRoute, (req, res, next)=>{ 
  res.status(200).send("SUPER SECRET USER BENEFIT!");
  next();
})


app.get(process.env.GOOGLE_CLIENT_CALLBACK_URL, 
    passport.authenticate('google', { failureRedirect: '/error/signin' }),
    (req, res, next) => {
      // Successful authentication, redirect home. 
      res.redirect('/dashboard');
      next();
    }
);
  
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
app.get("/me", securedRoute, (req, res, next)=>{  
  res.json(req?.user);
  next();
})

app.post('/logout', (req, res) => {

  var email = req?.user?.email;
  if(email){
    docCache[email] = null;
  }

  // Assuming you are using passport.js for authentication
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout error');
    }

    // Destroy the session and clear the cookie
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Session destruction error');
      }

      res.clearCookie('connect.sid'); // The default cookie name for express-session
      res.sendStatus(200); // Send a response status indicating success
    });
  });
});
// ****************************************************** Auth Routes End

// Handle file upload route
app.post('/upload', upload.single('file'), (req, res) => { 
  if (!req.file) {
    
    return res.status(400).send('No file uploaded.');
  }

  res.send({
    message: 'File uploaded successfully',
    file: req.file,
  });
  var email = req?.user?.email;
  if(email){
    docCache[email] = new VectorEmbedService(email);
    docCache[email].buildDocsAsync();
  }
});
app.get("/upload", securedRoute, (req,res)=>{
  var email = req?.user?.email;
  if(email)
  {
    var loaded = docCache[email]?.loaded;
    var count = docCache[email]?.count;
    res.status(200).sendJson({loaded, count})
  }else{
    res.status(404).send("Not found.");
  }
})

// other routes
app.use("/", indexRouter);

app.get('/files', (req, res) => {
  const userEmail = req?.user?.email; // Assuming req.user contains authenticated user's info
  if(!userEmail)
  {
    res.status(500).send("Server error.");
    return;
  }
  const userDir = path.join(__dirname, "data",'uploads', userEmail);

  fs.readdir(userDir, (err, files) => {
    if (err) {
      console.error('Could not read directory', err);
      return res.status(500).json({ error: 'Could not read user directory' });
    }


    res.json(files);
  });
});

app.delete('/files/:fileName', (req, res) => {
  try{

      if(!req?.user?.email){
        res.status(401).send("Bad Request.")
        return;
      }
      const decodedFileName = decodeURIComponent(req.params.fileName);
    
      const userEmail = req?.user?.email; 
      if(!userEmail)
      {
        res.status(500).send("Server Error.");
        return;
      }
    
      const filePath = path.join(__dirname, 'data/uploads', userEmail, decodedFileName);
    
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
              return res.status(500).send('Internal Server Error');
          }
          docCache[userEmail] = new VectorEmbedService(userEmail);
          res.status(200).send('File deleted successfully');
          docCache[userEmail].buildDocsAsync();
          return;
      });
    
      
  }catch(ex){
    logger.log("error delete /files/:filename", ex); 
  }

  
});


// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Serve static files or proxy to Vite in development
if (isDevelopment) {
    const VITE_DEV_SERVER_URL = 'http://localhost:5173';
    app.use('/', httpProxy(VITE_DEV_SERVER_URL));
} else {
    // Serve static files from the build directory
    app.use(express.static(path.join(__dirname, '../DigitalSignAssistant/dist')));

    // For all other routes, serve the React app's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../DigitalSignAssistant/dist', 'index.html'));
    });
}
 
// ejs init
app.set('view engine', 'ejs');


app.listen(8181, () => {
  console.log('Server started on http://localhost:8181');
});





















 