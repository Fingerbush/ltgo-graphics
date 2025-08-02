import { FastifyInstance, FastifyPluginAsync, FastifySchema, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose';
import { User } from '../schemas/auth/User.js';
import { getDate } from '../lib/utils.js';
import bcrypt from 'bcryptjs'
import { sanitizeUserInput } from '../lib/sanitization.js';

interface CreateUserBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const createUserSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      firstName: { type: 'string', maxLength: 50, minLength: 3 },
      lastName: { type: 'string' , maxLength: 50, minLength: 3 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8, maxLength: 128 }
    },
    required: ['firstName', 'lastName', 'email', 'password'],
    additionalProperties: false
  }
};

interface SanitizedRequest extends FastifyRequest {
    sanitizedBody: CreateUserBody
}

const usersRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.route<{
        Body: CreateUserBody;
      }>({
        method: 'POST',
        url: '/create',
        schema: createUserSchema,
        config: {
          rateLimit: {
            timeWindow: '1 minute',
            max: 5,
          },
        },
        preHandler: async (request, reply) => {
            const sanitizedBody: CreateUserBody = sanitizeUserInput(request.body) as CreateUserBody;
            (request as SanitizedRequest).sanitizedBody = sanitizedBody;
        },
        handler: async (request, reply) => {
            const { firstName, lastName, email, password } = (request as SanitizedRequest).sanitizedBody;

          try {
            const existingUser = await User.findOne({
                email: email
            })

            if (existingUser) {
                return reply.status(409).send({code: 'CONFLICT', message: 'Email has been registered.'})
            }

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new User({
                userId: uuidv4(),
                firstName: firstName,
                lastName: lastName,
                password: passwordHash,
                email: email
            })

            await newUser.save()

            reply.status(201).send({message: "Success"})
          } catch (err: any) {
            if (err instanceof mongoose.Error.ValidationError) {
                return reply.status(400).send({ 
                    code: 'BAD_REQUEST',
                    message: "Invalid user data."
                })
            }

            if (err.code === 11000) {
                return reply.status(409).send({
                  code: 'CONFLICT', 
                  message: 'Email has been registered.'
                });
              }

            console.error(`[ERROR] Error: ${err} occurred at ${getDate()} during the user signup phase.`)
            reply.status(500)
            .send({
                code: 'INTERNAL_ERROR',
                message: 'Something went wrong. Please try again later.'
            })
          }
        }
        
      });      
};

export default usersRoutes;