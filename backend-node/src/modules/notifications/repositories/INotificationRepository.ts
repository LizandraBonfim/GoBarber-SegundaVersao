import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import Notifications from '../infra/typeorm/schemas/Notification';

export default interface INotificationRepository{
    create(data: ICreateNotificationDTO): Promise<Notifications>;
}