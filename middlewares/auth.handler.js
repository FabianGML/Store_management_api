const boom = require('@hapi/boom');

/* 
    This function is to verify if the current user is able to access the end point 
    the function requires 1 or more stings depends of which kind of roles are able to access.
    "Admin" role is default able to access every endPoint
*/
function checkRoles(...roles){
    return (req, res, next) => {
        roles.push('admin')
        const user = req.user
        if(roles.includes(user.role)){
            next()
        } else {
            next(boom.unauthorized())
        }
    }
}

module.exports = { checkRoles }