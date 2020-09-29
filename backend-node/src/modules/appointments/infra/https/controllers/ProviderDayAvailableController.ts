import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListDayAvailableService from '@modules/appointments/services/ListDayAvailableService';

export default class ProviderDayAvailableController {
    public async index(req: Request, res: Response): Promise<Response> {

        const {provider_id} = req.params;

        const {day, month, year} = req.query;

        const listDayAvailableService = container.resolve(ListDayAvailableService);

        const available = await listDayAvailableService.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        });

        return res.json(available);

    }
}