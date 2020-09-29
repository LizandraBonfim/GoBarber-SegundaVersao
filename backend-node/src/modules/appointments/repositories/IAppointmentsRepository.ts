import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentsDTO from '../dtos/ICreateAppointmentsDTO';
import IFindlAllAppointmentsInMonthDTO from '../dtos/IFindlAllAppointmentsInMonthDTO';
import IFindlAllAppointmentsInDayDTO from '../dtos/IFindlAllAppointmentsInDayDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentsDTO): Promise<Appointment>;
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
    findAllAppointmentsFromMonth(data: IFindlAllAppointmentsInMonthDTO): Promise<Appointment[]>;
    findAllAppointmentsFromDay(data: IFindlAllAppointmentsInDayDTO): Promise<Appointment[]>;
}