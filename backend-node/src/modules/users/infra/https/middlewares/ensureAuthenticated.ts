import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from '@config/auth'

import AppErrors from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {

  const authHeader = request.headers.authorization;

  console.log(authHeader)

  if (!authHeader) {
    throw new AppErrors('Token nao validado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {

    console.log('trye', token);

    const decoded = verify(token, authConfig.jwt.secret);

    console.log('decoded::: ' , decoded);

    //forçando o decoded como interface do tokenpayload
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub
    }

    console.log(decoded);
  } catch {
    throw new AppErrors('Token JWT invalido', 401)
  }

  return next();

}