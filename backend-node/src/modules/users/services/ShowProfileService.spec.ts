import ShowProfileService from './ShowProfileService';
import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';



let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;


describe('UpdateProviderService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfileService = new ShowProfileService(fakeUserRepository);
    })

    it('should be able to update your profile', async () => {


        const user = await fakeUserRepository.create({
            name: 'liz',
            email: 'liz@liz.com',
            password: '485474524'
        });

        const updateUser = await showProfileService.execute({
            user_id: user.id,
        });

        expect(updateUser.name).toBe('liz');
        expect(updateUser.email).toBe('liz@liz.com');


    });

   



    it('should not be able to update your profile from non-existing user', async () => {



        expect(showProfileService.execute({
            user_id: 'non',
        })).rejects.toBeInstanceOf(AppError);



    });





})