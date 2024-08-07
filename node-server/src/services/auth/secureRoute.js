// uses cookie session to verify session

var securedRoute = (req, res, next) => 
{
    if(!req.user || !req.user.providerId){
        res.status(401).send("This resource is secured. Please log in.")
        return;
    }
    next();
}

module.exports = { securedRoute }