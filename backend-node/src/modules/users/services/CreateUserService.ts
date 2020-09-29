import { inject, injectable } from "tsyringe";

import User from "../infra/typeorm/entities/User";

import AppErrors from '../../../shared/errors/AppError';
import IUserRepository from "../repositories/IUserRepository";
import IHashProvider from "../Providers/HashProvider/models/IHashProvider";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {

  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) { }

  public async execute({ name, email, password }: Request): Promise<User> {


    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (!!checkUserExists) {
      console.log('deu erro')
      throw new AppErrors('Email já cadastrado.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;

  }
}

export default CreateUserService;