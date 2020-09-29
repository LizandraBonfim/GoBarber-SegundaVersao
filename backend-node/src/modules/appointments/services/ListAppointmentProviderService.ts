import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}


@injectable()
class ListAppointmentProviderService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider

    ) { }



    public async execute({ provider_id, day, year, month }: Request): Promise<Appointment[]> {

        const cacheKeys = `providers_appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKeys);

        if (!appointments) {
            appointments = await this.appointmentRepository.findAllAppointmentsFromDay({
                provider_id,
                day,
                month,
                year
            });

            console.log('buscou do banco')

            await this.cacheProvider.save(cacheKeys, classToClass(appointments));

        }



        return appointments;


    }
}

export default ListAppointmentProviderService;