import FakesAppointments from '../repositories/Fakes/FakesAppointments';
import CreateAppointmentsService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider' ;
import FakeNotification from '../../notifications/repositories/fakes/FakeNotificationRepository';

describe('CreateAppointmentsService', () => {

    it('should be able to create a new appointments', async () => {

        const fakeAppointmentsRepository = new FakesAppointments();
        const fakeNotification = new FakeNotification();
        const fakeCacheProvider = new FakeCacheProvider();

        const createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotification, fakeCacheProvider);

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 6, 20, 9),
            user_id: 'user_id',
            provider_id: 'provider_id'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider_id');


    });

    it('should not be able to create two appointments on the same time', async () => {

        const fakeAppointmentsRepository = new FakesAppointments();
        const fakeNotification = new FakeNotification();
        const fakeCacheProvider = new FakeCacheProvider();


        const createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotification, fakeCacheProvider);

        const appointmentDate = new Date();
        
        // const appointment = await createAppointmentService.execute({
        //     date: appointmentDate,
        //     user_id: '154652751',
        //     provider_id: '154652751'
        // });


        expect(createAppointmentService.execute({
            date: appointmentDate,
            user_id: '154652751',
            provider_id: '154652751'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not to be able to create appointment on a past date', async () => {
        const fakeAppointmentsRepository = new FakesAppointments();
        const fakeNotification = new FakeNotification();
        const fakeCacheProvider = new FakeCacheProvider();


        const createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotification, fakeCacheProvider);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 20, 12).getTime()
        });


        await expect(createAppointmentService.execute({
            date: new Date(2020, 7, 20, 11),
            user_id: '154652751',
            provider_id: '154652751'
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should not to be able to create appointment before 8am and after 5pm', async () => {
        const fakeAppointmentsRepository = new FakesAppointments();
        const fakeNotification = new FakeNotification();
        const fakeCacheProvider = new FakeCacheProvider();


        const createAppointmentService = new CreateAppointmentsService(fakeAppointmentsRepository, fakeNotification, fakeCacheProvider);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 20, 12).getTime()
        });


        await expect(createAppointmentService.execute({
            date: new Date(2020, 7, 20, 7),
            user_id: '154652751',
            provider_id: '154652751'
        })).rejects.toBeInstanceOf(AppError);

        await expect(createAppointmentService.execute({
            date: new Date(2020, 7, 20, 18),
            user_id: '154652751',
            provider_id: '154652751'
        })).rejects.toBeInstanceOf(AppError);
    })
})