const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_ROUTE;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/users/login`,
            `${api}/users/register`,
             {url: /\/api\/v1\/users\/workers(.*)/ , methods: ['GET'] },
             {url: /\/api\/v1\/users\/products(.*)/ , methods: ['GET'] },
            `${api}/categories/products`,
            {url: /\/api\/v1\/products\/product(.*)/ , methods: ['GET'] },
            {url: /\/api\/v1\/users\/addProduct(.*)/ , methods: ['PUT'] },
        ]
    })
}

async function isRevoked(req, token){
    if(!token.payload.isAdmin) {
       return true;
    }
}

module.exports = authJwt