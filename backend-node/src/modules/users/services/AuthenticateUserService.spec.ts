import AuthenticateUserService from './AuthenticateUserService';
import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import FakeHashProvider from '../Providers/HashProvider/Fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;


describe('AuthenticateUserService', () => {

    beforeEach(() => {

        fakeUsersRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    })

    it('should be able to authenticate', async () => {


        const user = await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '145156695'
        })

        const response = await authenticateUser.execute({
            email: 'liz@liz.com.br',
            password: '145156695'
        });
       
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    })

    

    it('should not be able to authenticate with non existing user', async () => {

        expect(authenticateUser.execute({
            email: 'liz@liz.com.br',
            password: '145156695'
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to authenticate with password non match', async () => {


        await fakeUsersRepository.create({
            name: 'Liz',
            email: 'liz@liz.com.br',
            password: '145156695'
        })

        await expect(authenticateUser.execute({
            email: 'liz@liz.com.br',
            password: '1478521422'
        })).rejects.toBeInstanceOf(AppError);


    });


})