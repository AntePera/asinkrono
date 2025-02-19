const jwt = require('jsonwebtoken');
const secretKey = 'tajni_kljuc'; // Ovdje bi trebao biti iz ENV varijabli

module.exports = function () {
  return async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, secretKey);
      ctx.state.user = { id: decoded.userId }; // Dodaj userId u state
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
    }
  };
};
