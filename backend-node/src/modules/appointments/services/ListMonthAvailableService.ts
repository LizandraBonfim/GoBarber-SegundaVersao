import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

type Response = Array<{
    day: number;
    available: boolean;
}>

@injectable()
class ListMonthAvailableServie {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository

    ) { }


    public async execute({ provider_id, year, month }: Request): Promise<Response> {

        const appointments = await this.appointmentRepository.findAllAppointmentsFromMonth({
            provider_id,
            month,
            year
        });

        console.log('ãppointment', appointments)

        console.log(appointments)

        const numberDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from(
            { length: numberDaysInMonth },
            (value, index) => index + 1
        );


        const available = eachDayArray.map(day => {

            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day

            });

            console.log(compareDate, new Date())

            return {
                day,
                available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10
            }
        })

        console.log(available)
        return available;
    }
}

export default ListMonthAvailableServie;