import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface Request {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type Response = Array<{
    hour: number;
    available: boolean;
}>

@injectable()
class ListMonthAvailableServie {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository

    ) { }


    public async execute({ provider_id, day, year, month }: Request): Promise<Response> {

        const appointments = await this.appointmentRepository.findAllAppointmentsFromDay({
            provider_id,
            day,
            month,
            year
        });

        const currentDate = new Date(Date.now());
        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart
        );

        const available = eachHourArray.map(hour => {
            const hasAppointments = appointments.find(appointment =>
                getHours(appointment.date) === hour
            );

            const appointmentDate = new Date(year, month - 1, day, hour);


            return {
                hour,
                available: !hasAppointments && isAfter(currentDate, appointmentDate)
            }
        });

        console.log(appointments);

        return available;
    }
}

export default ListMonthAvailableServie;