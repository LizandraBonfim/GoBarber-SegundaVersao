import "reflect-metadata";
import { injectable, inject } from 'tsyringe';
import User from "../infra/typeorm/entities/User";
import { sign } from 'jsonwebtoken';

import IHashProvider from '../Providers/HashProvider/models/IHashProvider';

import authConfig from '../../../config/auth';

import AppErrors from '../../../shared/errors/AppError';
import IUserRepository from "../repositories/IUserRepository";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
    ) { }

  public async execute({ email, password }: Request): Promise<Response> {

    console.log('email senha', {
      email, password
    })

    const user = await this.usersRepository.findByEmail(email);


    if (!user) {
      throw new AppErrors('Dados incorretos, favor verificar novamente', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);




    if (!passwordMatched) {
      throw new AppErrors('Dados incorretos, favor verificar novamente', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    console.log('4')


    return {
      user,
      token
    };
  }
}
export default AuthenticateUserService;