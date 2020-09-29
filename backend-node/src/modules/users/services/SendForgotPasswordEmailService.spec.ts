import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '../repositories/Fakes/FakeUserTokenRepository';

let fakeUsersRepository: FakeUserRepository;
let fakeSendForgotPassword: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPassword: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {

    beforeEach(() => {

        fakeUsersRepository = new FakeUserRepository();
        fakeSendForgotPassword = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        sendForgotPassword = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeSendForgotPassword,
            fakeUserTokenRepository
        );
    });

    it('should be able to recover the password using the email', async () => {


        const sendMail = jest.spyOn(fakeSendForgotPassword, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '14785214824'
        });

        await sendForgotPassword.execute({
            email: 'liz@liz.com.br'
        });

        expect(sendMail).toHaveBeenCalled();


    });

    it('should not be able to recover a non-existing user password', async () => {



        await expect(sendForgotPassword.execute({
            email: 'liz@liz.com.br'
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should generate a forgot password token', async () => {



        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '1234567'
        });

        await sendForgotPassword.execute({
            email: 'liz@liz.com.br'
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);


    });

})