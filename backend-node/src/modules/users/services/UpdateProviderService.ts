import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IHashProvider from '../Providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

import User from '../infra/typeorm/entities/User';
import AppErrors from '../../../shared/errors/AppError';

interface Request {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProviderService {

    constructor(
        @inject('UserRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) { }


    public async execute({ user_id, name, email, old_password, password }: Request): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppErrors('User not found');
        }


        const findMailExists = await this.usersRepository.findByEmail(email);

        if (findMailExists && findMailExists.id !== user_id) {
            throw new AppErrors('Email ja esta em uso');
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AppErrors('Deve preencher a senha antiga');

        }


        if (password && old_password) {

            const checkOldPassword = await this.hashProvider.compareHash(
                old_password, user.password
            );

            if (!checkOldPassword) {
                throw new AppErrors('Senhas informadas nao sao identicas.')
            }
            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);

    }
}

export default UpdateProviderService;