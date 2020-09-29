import { getMongoRepository, MongoRepository, Raw } from 'typeorm';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '../../dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

class NotficationRepository implements INotificationRepository {
    private notifications: Notification[] = [];



    public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(notification, { id: new ObjectID(), content, recipient_id });

        this.notifications.push(notification);

        return notification;
    }

}

export default NotficationRepository;