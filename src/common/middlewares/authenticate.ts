import * as jwt from 'jsonwebtoken';
import appConfig from '../../app.config';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, appConfig.jwt.secret as string, (err: any, user: any) => {
    if (err)
      return res.status(403).json({
        message: 'Unathourized',
      });
    req.user = user;

    next();
  });
};
