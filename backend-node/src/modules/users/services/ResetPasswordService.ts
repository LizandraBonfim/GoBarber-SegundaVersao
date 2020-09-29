import { inject, injectable } from "tsyringe";
import { addHours, isAfter } from 'date-fns';

import AppErrors from '../../../shared/errors/AppError';
import IUserRepository from "../repositories/IUserRepository";
import ITokenRepository from "../repositories/ITokenRepository";
import IHashProvider from '../Providers/HashProvider/models/IHashProvider';

interface Request {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {

  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: ITokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,


  ) { }

  public async execute({ token, password }: Request): Promise<void> {

    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppErrors('Token nao existe');
    }
    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppErrors('usuario nao existe');

    }

    const tokenCreated = userToken.created_at;
    const compareDate = addHours(tokenCreated, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppErrors('Link expirado');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;