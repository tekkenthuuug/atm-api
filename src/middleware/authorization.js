const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).json('Authorization method is not allowed (Bearer token required)');
  }
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }
  jwt.verify(token, 'secret', {}, (err, decoded) => {
    if (err || !decoded.accountNo || !decoded.cardNo) {
      return res.status(401).send('Unauthorized');
    }
    const { accountNo, cardNo, exp } = decoded;
    const currentTime = Date.now().valueOf() / 1000;
    if (exp < currentTime) {
      return res.status(401).send('Unauthorized');
    }
    res.locals = { ...res.locals, accountNo, cardNo };
    next();
  });
};

module.exports = requireAuth;
