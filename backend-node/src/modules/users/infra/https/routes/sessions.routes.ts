import { Router } from 'express';
import { container } from 'tsyringe';
import SessionsController from '../controllers/SessionsController';
import { celebrate, Segments, Joi } from 'celebrate';

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post('/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }), sessionsController.create);

export default sessionsRouter;