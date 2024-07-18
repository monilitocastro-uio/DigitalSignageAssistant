
let googleOAuthCallbackSignIn = function(accessToken, refreshToken, profile, done) {
    // Use the profile info (mainly profile id) to check if the user is registered in your db
    // If yes, select the user and pass him to done()
    // If not, create the user in db and pass the user to done()
    try{

        console.log('Profile:', profile);

        // Extract the profile information and put into DB
        var providerId = profile.id;
        var name = profile.displayName;
        var familyName = profile.name.familyName;
        var givenName = profile.name.givenName;
        var email = profile.emails[0].value;
        var photo = profile.photos[0].value;

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        return done(null, profile);
    }catch(ex){
        logger.error(ex);
        return
    }
  }

  module.exports = {googleOAuthCallbackSignIn};