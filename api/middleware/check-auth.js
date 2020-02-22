const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.userData = decoded;
            next();
        } catch (e) {
            return res.status(401).json({
                msg: "auth failed"
            })
        }
    } else {
        return res.status(401).json({
            msg: "auth failed"
        })
    }
}