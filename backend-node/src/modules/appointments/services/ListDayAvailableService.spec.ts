import AppError from '@shared/errors/AppError';
import ListDayAvailableService from './ListDayAvailableService';
import FakesAppointments from '../repositories/Fakes/FakesAppointments';

let listMonthAvailableService: ListDayAvailableService;
let fakesAppointments: FakesAppointments;


describe('ListDayAvailableService', () => {

    beforeEach(() => {
        fakesAppointments = new FakesAppointments();
        listMonthAvailableService = new ListDayAvailableService(fakesAppointments);
    })

    it('should be able to list the day available from provider', async () => {

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 5, 8,0,0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 5, 9,0,0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 5, 14,0,0)
        })

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 5, 15,0,0)
        });

        await fakesAppointments.create({
            user_id: '154652751',
            provider_id: '14741',
            date: new Date(2020, 8, 5, 15,0,0)
        })
        

        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 7, 14, 11 ).getTime()
        })
        const available = await listMonthAvailableService.execute({
            provider_id: '14741',
            year: 2020,
            month: 7,
            day: 5
        })

        expect(available).toEqual(expect.arrayContaining([

            {hour: 8, available: true },
            {hour: 9, available: false },
            {hour: 10, available: false },
            {hour: 11, available: true },
            {hour: 12, available: true },
            {hour: 13, available: true },
            {hour: 14, available: true },
        ]))  
      

    });

})