const jwt = require('jsonwebtoken');

const authmiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).send({
                msg: 'Access Denied. No token provided'
            });
        }

        // "Bearer eyJ..." --> eyJ...
        const actualToken = token.split(' ')[1];

        const verified = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (err) {
        console.log(err);
        res.status(400).send({
            msg: 'invalid token'
        });
    }
};

module.exports = authmiddleware;