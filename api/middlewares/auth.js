const jwt = require("jsonwebtoken");

const config = {
    "secret": "some-secret-shit-goes-here",
    "refreshTokenSecret": "some-secret-refresh-token-shit",
    "port": 3000,
    "tokenLife": "240 m",
    "refreshTokenLife": 86400
}



module.exports.verify = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {

        const token = bearerHeader.split(" ")[1];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
                }

                // var decod = jwt.decode(token);

                // get the decoded payload and header
                var decod = jwt.decode(token, { complete: true });
                console.log(decod.header);
                console.log(decod.payload)
                req.decoded = decod.payload;
                next();
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                "error": true,
                "message": 'Invalid Token provided.'
            });
        }
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            "error": true,
            "message": 'No token provided.'
        });
    }
}

module.exports.jwtGenerator = (req, res, doc) => {
    const postData = req.body;
    console.log("here nko --- ", req, doc);
    const user = {
        "phoneNumber": postData.phoneNumber,
    }
    // do the database authentication here, with user name and password combination.
    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife })
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife })
    const response = {
        "createdAt": Date.now(),
        "mobileNumber": req.body.phoneNumber,
        "token": token,
        "refreshToken": refreshToken,
    }
    res.status(200).json({ dataAdded: doc.name != undefined, token: response });
};

module.exports.refresh = (req, res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "phoneNumber": postData.phoneNumber,
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife })
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife })
        const response = {
            "createdAt": Date.now(),
            "mobileNumber": req.body.phoneNumber,
            "token": token,
            "refreshToken": refreshToken,
        }
        res.status(200).json({ dataAdded: doc.name != undefined, token: response });
    } else {
        res.status(404).send('Invalid request')
    }
};