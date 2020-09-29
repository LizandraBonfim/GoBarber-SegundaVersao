import { Router, Request, Response } from 'express';

import appointmentsRouter from '../../../../modules/appointments/infra/https/routes/appointments.routes';
import usersRouter from '../../../../modules/users/infra/https/routes/users.routes';
import sessionsRouter from '../../../../modules/users/infra/https/routes/sessions.routes';
import passwordRouter from '../../../../modules/users/infra/https/routes/password.routes';
import profileRouter from '../../../../modules/users/infra/https/routes/profile.routes';
import providersRouter from '../../../../modules/appointments/infra/https/routes/providers.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/providers', providersRouter);

routes.get('/', (req: Request, res: Response) => {
  const { name, email } = req.body;

  const user = {
    name, email
  }

  return res.json(user);
});

export default routes;