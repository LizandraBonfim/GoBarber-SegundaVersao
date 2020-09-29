import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/errors/AppError';


const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: undefined,
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 6,
    duration: 5,
})

export default async function raterLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(redisClient);
    try {
        await limiter.consume(req.ip);

        return next();

    } catch (error) {
        throw new AppError('Too many request', 429);
    }
}