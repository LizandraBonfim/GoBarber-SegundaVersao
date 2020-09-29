import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from './routes';
import uploadConfig from '../../../config/Upload';

import AppError from '../../errors/AppError';
import '../typeorm';
import '@shared/container';
import raterLimiter from '@shared/infra/https/middlewares/raterLimiter';

const api = express();


api.use(express.json());

api.use(cors());

api.use('/files', express.static(uploadConfig.uploadFolders));
api.use(raterLimiter);
api.use(routes);

api.use(errors());


api.use((err: Error, request: Request, response: Response, next: NextFunction) => {

  console.log('ocorreu um erro', err);

  if (err instanceof AppError) {
    response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })

  next(err)
});

api.listen(3333, () => {
  console.log('rodando')
});