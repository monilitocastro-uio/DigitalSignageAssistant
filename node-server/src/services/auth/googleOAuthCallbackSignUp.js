const jwt = require('jsonwebtoken');
const User = require('../../models/user'); // path to the user model
const postgresWrapper = require('../../postgresWrapper');

async function googleOAuthCallbackSignUp(req, res) {
    const { accessToken, refreshToken, profile } = req;
    try {
        // Connect to PostgreSQL
        await postgresWrapper.pool.connect();

        // Extract required information from profile
        const providerId = profile.id;
        const name = profile.displayName;
        const familyName = profile.name.familyName;
        const givenName = profile.name.givenName;
        const email = profile.emails[0].value;
        const photo = profile.photos[0].value;

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
            { expiresIn: '1h' }
        );

        // Send the JWT token as a response
        res.json({ token });
    } catch (error) {
        console.error('Error during Google OAuth callback sign-up:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Release the PostgreSQL client connection
        await postgresWrapper.pool.end();
    }
}

module.exports = {googleOAuthCallbackSignUp};
