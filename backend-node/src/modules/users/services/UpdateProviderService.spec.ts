import FakeHashProvider from '../Providers/HashProvider/Fakes/FakeHashProvider';
import UpdateProviderService from './UpdateProviderService';
import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';



let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProviderService: UpdateProviderService;


describe('UpdateProviderService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProviderService = new UpdateProviderService(fakeUserRepository, fakeHashProvider);
    })

    it('should be able to update your profile', async () => {


        const user = await fakeUserRepository.create({
            name: 'liz',
            email: 'liz@liz.com',
            password: '485474524'
        });

        const updateUser = await updateProviderService.execute({
            user_id: user.id,
            name: 'Lizandra',
            email: 'lian@email.com'
        });

        expect(updateUser.name).toBe('Lizandra');
        expect(updateUser.email).toBe('lian@email.com');


    });

    it('should not be able to change to another user email', async () => {

        await fakeUserRepository.create({
            name: 'liz',
            email: 'liz@liz.com',
            password: '485474524'
        });


        const user = await fakeUserRepository.create({
            name: 'test',
            email: 'test@liz.com',
            password: '485474524'
        });



        await expect(updateProviderService.execute({
            user_id: user.id,
            name: 'liz',
            email: 'liz@liz.com'
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should  be able to update your password', async () => {



        const user = await fakeUserRepository.create({
            name: 'test',
            email: 'test@liz.com',
            password: '485474524'
        });

        const updateuser = await updateProviderService.execute({
            user_id: user.id,
            name: 'liz',
            email: 'liz@liz.com',
            old_password: '485474524',
            password: '12345678'
        })

            
        expect(updateuser.password).toBe('12345678');


    });

    it('should not be able to update your profile from non-existing user', async () => {



        expect(updateProviderService.execute(
            {
                user_id: 'non',
                name: 'ola pessual',
                email: 'non@non.com'
            }
        )).rejects.toBeInstanceOf(AppError);



    });

    // it('should  not be able to update your password without old password', async () => {



    //     const user = await fakeUserRepository.create({
    //         name: 'test',
    //         email: 'test@liz.com',
    //         password: '485474524'
    //     });

    //     const updateuser = await updateProviderService.execute({
    //         user_id: user.id,
    //         name: 'liz',
    //         email: 'liz@liz.com',
    //         password: '12345678'
    //     })


    //     expect(updateuser.password).rejects.toBeInstanceOf(AppError);



    // });

    // it('should  not be able to update your password with wrong old password', async () => {



    //     const user = await fakeUserRepository.create({
    //         name: 'test',
    //         email: 'test@liz.com',
    //         password: '485474524'
    //     });

    //     const updateuser = await updateProviderService.execute({
    //         user_id: user.id,
    //         name: 'liz',
    //         email: 'liz@liz.com',
    //         old_password: '485474524',
    //         password: '12345678'
    //     })


    //     expect(updateuser.password).rejects.toBeInstanceOf(AppError);


    // });




})