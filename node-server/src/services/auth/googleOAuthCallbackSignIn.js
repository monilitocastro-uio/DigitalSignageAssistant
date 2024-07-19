const jwt = require('jsonwebtoken');
const User = require('../../models/user'); // path to the user model 
const PostgresWrapper = require('../../models/PostgresWrapper');
const { loadSettings } = require('../settings/loadingSettings');

async function googleOAuthCallbackSignIn(accessToken, refreshToken, profile, done) {  
    try {
        // Connect to PostgreSQL
        await PostgresWrapper.pool.connect();

        // Extract required information from profile
        const providerId = profile.id;
        const name = profile.displayName;
        const familyName = profile.name.familyName;
        const givenName = profile.name.givenName;
        const email = profile.emails[0].value;
        const photo = profile.photos[0].value;

        // get regex string
        const settings = loadSettings();
        var regex = null;
        if(settings){ 
            regex = new RegExp(settings.allowed_emails_regex_string);
        }

        if(!regex)
        {
            console.log('Error: No regex string found in settings');
            done(null, null);
            return;
        }

        // check if email is allowed
        if(!regex.test(email))
        {
            console.log('Error: Email not allowed');
            done(null, null);
            return;
        }

        // Check if user already exists
        let user = await User.findOneByGoogleId(providerId);
        if (!user) {
            // Create new user
            user = await User.create({
                providerId,
                name,
                familyName,
                givenName,
                email,
                photo
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.APP_SECRET,
            { expiresIn: '7d' }
        );

        // Send the JWT token as a response
        done(null, { token, accessToken, refreshToken, profile });
    } catch (error) {
        console.error('Error during Google OAuth callback sign-up:', error);
        done(error, null);
    } finally {
        // Release the PostgreSQL client connection
        await PostgresWrapper.pool.end();
    }
}

module.exports = {googleOAuthCallbackSignIn};
