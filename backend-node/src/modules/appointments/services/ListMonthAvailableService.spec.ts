import AppError from '@shared/errors/AppError';
import ListMonthAvailableService from './ListMonthAvailableService';
import FakesAppointments from '../repositories/Fakes/FakesAppointments';

let listMonthAvailableService: ListMonthAvailableService;
let fakesAppointments: FakesAppointments;


describe('ListMonthAvailableService', () => {

    beforeEach(() => {
        fakesAppointments = new FakesAppointments();
        listMonthAvailableService = new ListMonthAvailableService(fakesAppointments);
    })

    it('should be able to list the month available from provider', async () => {

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 8, 0, 0)
        })

        await fakesAppointments.create({
            provider_id: '14741',
            user_id: '154652751',
            date: new Date(2020, 8, 1, 9, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 10, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 11, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 12, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 13, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 14, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 15, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 16, 0, 0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 1, 17, 0, 0)
        })




        const available = await listMonthAvailableService.execute({
            provider_id: '14741',
            year: 2020,
            month: 9,
        })

        expect(available).toEqual(expect.arrayContaining([
            { day: 1, available: false },
            { day: 5, available: true },
            { day: 7, available: true },
        ]))



    });

})