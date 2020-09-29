import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { getRepository, Repository, Raw } from 'typeorm';
import ICreateAppointmentsDTO from '../../../dtos/ICreateAppointmentsDTO';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindlAllAppointmentsInMonthDTO from '@modules/appointments/dtos/IFindlAllAppointmentsInMonthDTO';
import IFindlAllAppointmentsInDayDTO from '@modules/appointments/dtos/IFindlAllAppointmentsInDayDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {

    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id }, //ou where: {date: date}
    });

    return findAppointment || undefined;
  }

  public async findAllAppointmentsFromMonth({ provider_id, month, year }: IFindlAllAppointmentsInMonthDTO): Promise<Appointment[]> {

    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dataFieldName =>
          `to_char(${dataFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )
      }
    }
    );

    return findAppointment;

  }

  public async findAllAppointmentsFromDay({ provider_id, day, month, year }: IFindlAllAppointmentsInDayDTO): Promise<Appointment[]> {

    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dataFieldName =>
          `to_char(${dataFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )
      },
      relations: ['user'],
    });


    return findAppointment;

  }


  public async create({ provider_id, user_id, date }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }

}

export default AppointmentsRepository;