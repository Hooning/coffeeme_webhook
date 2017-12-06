const REQUIRE_AUTH = true

//export js files
module.exports = {
    authCheck: function(authToken){
        // we have a simple authentication
        if (REQUIRE_AUTH) {
            if (req.headers['auth-token'] !== authToken) {
                return res.status(401).send('Unauthorized')
            }
        }
    },
    valCheck: function(req){
        // and some validation too
        if (!req.body || !req.body.result || !req.body.result.parameters) {
            return res.status(400).send('Bad Request')
        }
    },
}