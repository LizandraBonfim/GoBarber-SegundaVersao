import ListProviderService from './ListProviderService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider' ;



let fakeUserRepository: FakeUserRepository;
let listProviders: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;


describe('ListProviderService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProviderService(fakeUserRepository, fakeCacheProvider);
    })

    it('should be able to list the profile', async () => {


        const user1 = await fakeUserRepository.create({
            name: 'liz1',
            email: 'liz@liz.com',
            password: '485474524'
        });

        const user2 = await fakeUserRepository.create({
            name: 'liz2',
            email: 'liz@liz.com',
            password: '485474524'
        });

        const userLogged = await fakeUserRepository.create({
            name: 'liz3',
            email: 'liz@liz.com',
            password: '485474524'
        });

        const users = await listProviders.execute({
            user_id: userLogged.id,
        });

        expect(users).toEqual([user1, user2]);


    });





    it('should not be able to update your profile from non-existing user', async () => {



        expect(listProviders.execute({
            user_id: 'non',
        })).rejects.toBeInstanceOf(AppError);



    });





})