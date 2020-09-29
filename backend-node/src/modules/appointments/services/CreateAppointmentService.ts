import { inject, injectable } from "tsyringe";
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppErrors from '../../../shared/errors/AppError';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { ptBR } from "date-fns/locale";


interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {

  }

  public async execute({ date, user_id, provider_id }: Request): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppErrors('Nao e possivel realizar agendamento data passada');
    }

    if (user_id === provider_id) {
      throw new AppErrors('Nao e possivel realizar agendamento com voce mesma');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppErrors('Horario de atendimento: 8am e 17pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository
      .findByDate(appointmentDate, provider_id);

    console.log(findAppointmentInSameDate);

    if (findAppointmentInSameDate) {
      throw new AppErrors('Já existe agendamento para esse horario e data');
    }


    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    });

    // const createNotification = container.resolve(CreateNotificationService);

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `providers_appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
    );

    return appointment;
  }

}

export default CreateAppointmentService;