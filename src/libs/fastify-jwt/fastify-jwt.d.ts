import { Roles } from '@prisma/client';
import 'fastify/jwt'

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: {
            sub: string;
            role: Roles;
        }
    }
}