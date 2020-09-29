import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import { uuid } from 'uuidv4';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentsDTO from '../../dtos/ICreateAppointmentsDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindlAllAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindlAllAppointmentsInMonthDTO';
import IFindlAllAppointmentsInDayDTO from '@modules/appointments/dtos/IFindlAllAppointmentsInDayDTO';

class FakesAppointments implements IAppointmentsRepository {

    private appointments: Appointment[] = [];

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment => isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id
        );

        return findAppointment;

    }

    public async findAllAppointmentsFromMonth({ provider_id, month, year }: IFindlAllAppointmentsInMonthDTO): Promise<Appointment[]> {

        const findAppointment = this.appointments.filter(
            appointment => appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
        );

        console.log(findAppointment)
        return findAppointment;

    }

    public async findAllAppointmentsFromDay({ provider_id, day, month, year }: IFindlAllAppointmentsInDayDTO): Promise<Appointment[]> {

        const findAppointment = this.appointments.filter(
            appointment => appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
        );

        return findAppointment;

    }

    public async create({ provider_id, user_id, date }: ICreateAppointmentsDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), provider_id, date, user_id });

        // OUUU 

        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;

    }

}

export default FakesAppointments;