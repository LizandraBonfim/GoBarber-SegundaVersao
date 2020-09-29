import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import HashProvider from '../Providers/HashProvider/Fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider' ;


let fakeUsersRepository: FakeUserRepository;
let hashProvider: HashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;


describe('CreateUserService', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        hashProvider = new HashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(fakeUsersRepository, hashProvider, fakeCacheProvider);
    })

    it('should be able to create a new user', async () => {


        const user = await createUserService.execute({
            name: 'liz',
            email: 'liz@liz.com.br',
            password: '145156695'
        });

        expect(user).toHaveProperty('id');


    });

    it('should not be able to create two email exists ', async () => {


        const user = await createUserService.execute({
            name: 'liz',
            email: 'liz@liz.com.br',
            password: '145156695'
        });

        await expect(createUserService.execute({
            name: 'liz',
            email: 'liz@liz.com.br',
            password: '145156695'
        })).rejects.toBeInstanceOf(AppError);


    });
})