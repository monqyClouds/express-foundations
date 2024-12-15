import type {NextFunction, Request, Response} from 'express';
import {JsonWebTokenError} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Logger} from '../utils/log-writer';
import {ErrorTypes, customError, errorDispatcher, getUserIp} from '../utils';

export const APIAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization?.split(' ').at(1);

  if (!authToken) {
    return errorDispatcher(res, {
      type: ErrorTypes.Unauthorized,
      message: 'unauthenticated',
      errors: 'unauthenticated',
    });
  }

  try {
    const userIpHash = getUserIp(authToken);

    if (!userIpHash || !req.ip) {
      throw customError({
        name: 'noIPAddress',
        message: 'Unable to authenticate',
      });
    }

    const isValidSession = await bcrypt.compare(req.ip, userIpHash);

    if (!isValidSession) {
      return errorDispatcher(res, {
        type: ErrorTypes.Unauthorized,
        message: 'invalid/expired session',
        errors: 'unauthenticated',
      });
    }

    return next();
  } catch (err) {
    Logger.error(err as Error, 'Session validation error');

    if (err instanceof JsonWebTokenError) {
      return errorDispatcher(res, {
        type: ErrorTypes.Unauthorized,
        message: 'unable to authenticate',
        errors: 'unauthenticated',
      });
    }

    if (err instanceof Error && err.name === 'noIPAddress') {
      return errorDispatcher(res, {
        type: ErrorTypes.Unauthorized,
        message: 'unable to authenticate',
        errors: 'unauthenticated',
      });
    }

    return errorDispatcher(res, {
      type: ErrorTypes.ServerError,
      message: 'server error',
      errors: undefined,
    });
  }
};
