import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/https/middlewares/ensureAuthenticated';
import ListProvidersController from '@modules/appointments/infra/https/controllers/ListProvidersController';
import ProviderDayAvailableController from '@modules/appointments/infra/https/controllers/ProviderDayAvailableController';
import ProviderMonthAvailableController from '@modules/appointments/infra/https/controllers/ProviderMonthAvailableController';
import { celebrate, Segments, Joi } from 'celebrate';

const povidersRouter = Router();
const listProviders = new ListProvidersController();
const providerDayAvailable = new ProviderDayAvailableController();
const providerMonthAvailable = new ProviderMonthAvailableController();

povidersRouter.use(ensureAuthenticated);

povidersRouter.get('/', listProviders.index);

povidersRouter.get('/:provider_id/month-availability',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required()
        },
    }),
    providerMonthAvailable.index);

povidersRouter.get('/:provider_id/day-availability',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required()
        },
    }), providerDayAvailable.index);

export default povidersRouter;