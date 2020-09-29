import ListAppointmentProviderService from './ListAppointmentProviderService';
import FakesAppointments from '@modules/appointments/repositories/Fakes/FakesAppointments';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider' ;




let fakesAppointments: FakesAppointments;
let listAppointmentProviderService: ListAppointmentProviderService;
let fakeCacheProvider: FakeCacheProvider;


describe('ListProviderService', () => {

    beforeEach(() => {
        fakesAppointments = new FakesAppointments();
        fakeCacheProvider = new FakeCacheProvider();
        
        listAppointmentProviderService = new ListAppointmentProviderService(
            fakesAppointments, fakeCacheProvider
        );
    })

    it('should be able to list the appointments on a specific day', async () => {


        const user1 = await fakesAppointments.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020,6,20, 12,0,0)
        });

        const user2 = await fakesAppointments.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020,6,20, 13,0,0)
        });

        const available = await listAppointmentProviderService.execute({
            provider_id: 'provider',
            day: 20,
            month: 7,
            year: 2020
        });

        expect(available).toEqual([user1, user2]);


    });


})