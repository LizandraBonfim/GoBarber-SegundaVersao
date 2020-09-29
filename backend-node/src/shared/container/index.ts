import { container } from 'tsyringe';

import '@modules/users/Providers';
import './providers';   

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IHashProvider from '@modules/users/Providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/Providers/HashProvider/Implementations/BCryptHashProvider';

import ITokenRepository from '@modules/users/repositories/ITokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';
import RedisCacheProvider from './providers/CacheProvider/implementations/RedisCacheProvider';
import ICacheProvider from './providers/CacheProvider/models/ICacheProvider';



container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository', AppointmentsRepository
);

container.registerSingleton<IUserRepository>(
    'UserRepository', UsersRepository
);

container.registerSingleton<IHashProvider>(
    'HashProvider', BCryptHashProvider
);  

container.registerSingleton<ITokenRepository>(
    'UserTokenRepository', UserTokenRepository
);

container.registerSingleton<INotificationRepository>(
    'NotificationRepository', NotificationRepository
);



const providers ={
    redis: RedisCacheProvider,
}

container.registerSingleton<ICacheProvider>(
    'CacheProvider',
    providers.redis
)

