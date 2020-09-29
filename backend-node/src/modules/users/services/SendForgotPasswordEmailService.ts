import { inject, injectable } from "tsyringe";
import path from 'path';

import AppErrors from '../../../shared/errors/AppError';
import IUserRepository from "../repositories/IUserRepository";
import ITokenRepository from "../repositories/ITokenRepository";
import IMailProvider from '@shared/container/providers/MailProvider/model/IMailProvider';


interface Request {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {

    constructor(
        @inject('UserRepository')
        private usersRepository: IUserRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokenRepository')
        private userTokenRepository: ITokenRepository,

    ) { }

    public async execute({ email }: Request): Promise<void> {

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppErrors('Usuario nao existe');

        }

        const { token } = await this.userTokenRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(
            __dirname, '..', 'views', 'forgot_password.hbs');

        await this.mailProvider.sendMail({
            to: {
                name: user.id,
                email: user.email
            },
            subject: '[GOBarber] Recuperaca de Senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    user: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
                }
            }
        });



    }
}

export default SendForgotPasswordEmailService;