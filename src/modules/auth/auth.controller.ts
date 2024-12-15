import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {validateLoginReqPayload} from '../../utils/validators/auth.validator';
import * as authServices from './auth.service';
import {
  ErrorTypes,
  Logger,
  errorDispatcher,
  issueJWT,
  successResDispatcher,
} from '../../utils';
import {ZodError} from 'zod';

export async function login(req: Request, res: Response) {
  try {
    const credentials = validateLoginReqPayload(req.body);
    const isValidUser = authServices.validateLoginCredentials(credentials);

    if (!isValidUser) {
      return errorDispatcher(res, {
        type: ErrorTypes.Unauthorized,
        message: 'Invalid login credentials',
        errors: 'unauthenticated',
      });
    }

    if (!req.ip) {
      return errorDispatcher(res, {
        type: ErrorTypes.BadRequest,
        message: 'User cannot be authenticated',
        errors: 'unauthenticated',
      });
    }

    const hash = await bcrypt.hash(req.ip, 10);

    const token = issueJWT(hash);

    return successResDispatcher(res, {
      statusCode: 201,
      data: {token},
    });
  } catch (err) {
    let errType = ErrorTypes.ServerError;
    let errMsg = 'Server error';
    let errors;

    if (err instanceof ZodError) {
      errType = ErrorTypes.BadRequest;
      errMsg = 'Invalid request';
      errors = err.issues.map(el => el.message);
    } else if (err instanceof Error && err.name === 'invalidAction') {
      errType = ErrorTypes.BadRequest;
      errMsg = err.message;
      errors = err.message;
    } else {
      Logger.error(err as Error);
    }

    return errorDispatcher(res, {
      type: errType,
      message: errMsg,
      errors,
    });
  }
}
