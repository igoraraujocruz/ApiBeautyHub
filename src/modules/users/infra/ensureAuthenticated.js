import { verify } from 'jsonwebtoken';

import authConfig from '../../../auth.js';

export default function ensureAuthenticated(
  req,
  res,
  next,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
        message: 'JWT token is missing'
    })
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.secret);

    const { sub } = decoded;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    return res.status(401).json({
        message: 'JWT token is missing'
    })
  }
}