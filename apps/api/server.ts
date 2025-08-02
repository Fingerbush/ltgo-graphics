import Fastify from 'fastify'
import mongoSanitize from '@exortek/fastify-mongo-sanitize';

import rateLimit from '@fastify/rate-limit'

import { getDate } from './lib/utils.js';

import dotenv from 'dotenv'
dotenv.config({path: '../../.env'})

import usersRoutes from './_routes/users.js';

import mongoose from 'mongoose';

async function buildServer() {
    const fastify = Fastify({
      logger: false,
      ajv: {
        customOptions: {
          removeAdditional: false,
          allErrors: true,
          strict: true,
        },
      },
    });
  
    fastify.register(rateLimit);
    fastify.register(mongoSanitize.default);
  
    await mongoose.connect(process.env.MONGO_URI!);
  
    fastify.register(usersRoutes, { prefix: '/v1/users' });
  
    return fastify;
  }
  
  async function start() {
    try {
      const fastify = await buildServer();
      await fastify.listen({ port: 8000, host: '0.0.0.0' });
      console.log(`[START] API service starting | ${getDate()} `);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  
  start();
  