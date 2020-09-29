import { Router } from 'express';
import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/Upload';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import UpdateUserAvatarService from '../modules/users/services/UpdateUserAvatarService'
import CreateUserService from '../modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/https/middlewares/ensureAuthenticated';
import BCryptHashProvider from '@modules/users/Providers/HashProvider/Implementations/BCryptHashProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

const usersRouter = Router();

const upload = multer(uploadConfig);

const userRepository = new UsersRepository();
const hashProvider = new BCryptHashProvider();
const diskStorageProvider = new DiskStorageProvider();

usersRouter.post('/', async (req, res) => {

  const { name, email, password } = req.body;

  const createUser = new CreateUserService(userRepository, hashProvider);

  const user = await createUser.execute({
    name, email, password
  });

  return res.json(user);


});

usersRouter.patch('/avatar', ensureAuthenticated,
  upload.single('avatar'), async (request, response) => {


    const updateUserAvatar = new UpdateUserAvatarService(userRepository, diskStorageProvider);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });


    return response.json(classToClass(user));

  });

export default usersRouter;