import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListMonthAvailableService from '@modules/appointments/services/ListMonthAvailableService';

export default class ProviderMonthAvailableController {
    public async index(req: Request, res: Response): Promise<Response> {

        const {provider_id} = req.params;

        const { month, year} = req.query;

        const listMonthAvailableService = container.resolve(ListMonthAvailableService);

        const available = await listMonthAvailableService.execute({
            provider_id,
            month: Number(month),
            year: Number(year)
        });

        return res.json(available);

    }
}