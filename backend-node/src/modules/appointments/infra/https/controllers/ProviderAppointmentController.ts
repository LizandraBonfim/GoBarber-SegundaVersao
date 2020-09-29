import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListAppointmentProviderService from '../../../services/ListAppointmentProviderService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentController {
    public async index(req: Request, res: Response): Promise<Response> {

        const provider_id = req.user.id;
        const { day, month, year } = req.query;


        const listAppointmentProvider = container.resolve(ListAppointmentProviderService);

        const appointments = await listAppointmentProvider.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        });

        return res.json(classToClass(appointments));

    }
}