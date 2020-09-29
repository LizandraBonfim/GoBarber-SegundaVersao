import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageAvatar';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUserRepository from '../repositories/Fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';



describe('CreateUserService', () => {

    it('should be able to update user avatar', async () => {

        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const createUserService = new UpdateUserAvatarService(
            fakeUserRepository, fakeStorageProvider
        );

        const user = await fakeUserRepository.create({
            name: 'liz',
            email: 'liz@liz.com',
            password: '485474524'
        });

        await createUserService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.pnj'
        });

        expect(user.avatar).toBe('avatar.pnj');


    });

    it('should not be able to update user avatar', async () => {

        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const createUserService = new UpdateUserAvatarService(
            fakeUserRepository, fakeStorageProvider
        );



        expect(createUserService.execute({
            user_id: 'usuario-nao-existe',
            avatarFilename: 'avatar.pnj'
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should delete old avatar  when updating new one', async () => {

        const fakeUserRepository = new FakeUserRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const createUserService = new UpdateUserAvatarService(
            fakeUserRepository, fakeStorageProvider
        );

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUserRepository.create({
            name: 'liz',
            email: 'liz@liz.com',
            password: '485474524'
        });


        await createUserService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.pnj'
        });

        await createUserService.execute({
            user_id: user.id,
            avatarFilename: 'avata2r.pnj'
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.pnj')

        expect(user.avatar).toBe('avata2r.pnj');


    });



})