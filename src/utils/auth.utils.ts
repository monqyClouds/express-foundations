import jwt, {JwtPayload} from 'jsonwebtoken';
import {JWT_SECRET_KEY} from '../config';

export function getUserIp(tokenString: string) {
  const decoded = jwt.verify(tokenString, JWT_SECRET_KEY) as JwtPayload;

  return decoded.sub;
}

export function issueJWT(userIp: string) {
  const payload = {
    sub: userIp,
  };

  return jwt.sign(payload, JWT_SECRET_KEY, {
    noTimestamp: true,
    algorithm: 'HS256',
    expiresIn: '2h',
  });
}
