const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
    }
};

const authenticateAdmin = (req, res, next) => {
    authenticateUser(req, res, () => {
        if (req.userRole !== 'admin') {
            return res.status(403).send({ message: 'Admin access required' });
        }
        next();
    });
};

module.exports = { authenticateUser, authenticateAdmin };
