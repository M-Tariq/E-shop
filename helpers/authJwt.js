const { expressjwt } = require('express-jwt');

function authJwt() {
    console.log("here")
    const isTokenCorrect = expressjwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'] }).unless({
        path: [
            {
                url:"/|/api\/v1/users/login(.*)/",
            },
            {
                url:"/\/apiy\/v1\/categories(.*)/",
                methods:['GET', 'OPTIONS']
            },
            {
                url:"/api/v1/products(.*)/",
                methods:['GET', 'OPTIONS']
            }

        ]
    });
    console.log("isTokenCorrect:", isTokenCorrect);
    return isTokenCorrect

}


module.exports = authJwt;