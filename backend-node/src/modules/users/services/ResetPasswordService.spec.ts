import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokenRepository from '../repositories/Fakes/FakeUserTokenRepository';
import FakeHashProvider from '../Providers/HashProvider/Fakes/FakeHashProvider';

let fakeUsersRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {

    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUserRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        );
    });

    it('should not be able to recover a non-existing user password', async () => {



        const user = await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '14785214824'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);


        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
        await resetPasswordService.execute({
            token,
            password: `25153366`
        });

        const updatedPassword = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('25153366');
        expect(updatedPassword?.password).toBe('25153366');



    });

    it('should not be able to reset the password with non-existing token', async () => {

        await expect(
            resetPasswordService.execute({

                token: 'non-exixste',
                password: '14722222'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokenRepository.generate('non-exiting');

        await expect(
            resetPasswordService.execute({

                token,
                password: '14722222'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to reset the password if passed more then 2 hours', async () => {



        const user = await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '14785214824'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });;



        await expect(resetPasswordService.execute({
            password: '14785214824777',
            token,
        })).rejects.toBeInstanceOf(AppError);



    });

});