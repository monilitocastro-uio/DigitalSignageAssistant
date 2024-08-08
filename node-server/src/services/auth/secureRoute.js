// uses cookie session to verify session

var securedRoute = (req, res, next) => 
{
    if(!req.user || !req.user.providerId){
        return res.status(401).render('error/signin', { title: 'Sign In Error' }); 
    }
    next();
}

module.exports = { securedRoute }