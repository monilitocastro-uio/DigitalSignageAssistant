// uses cookie session to verify session

export const securedRoute = (req, res, next) => 
{
    if( !req?.user?.providerId){
        return res.status(401).render('error/signin', { title: 'Sign In Error' }); 
    }
    next();
}
 