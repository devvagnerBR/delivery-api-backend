import fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import { userRoutes } from "./routes/user-router";
import { ZodError } from "zod";
import { CustomError } from "./entities/custom-error";


export const app = fastify();

app.register( userRoutes );

app.setErrorHandler( ( error, _, res ) => {

    if ( error instanceof ZodError ) {

        return res
            .status( 400 )
            .send( { message: error.format() } );
    } else if ( error instanceof CustomError ) {
        res.status( error.statusCode ).send( {
            statusCode: error.statusCode,
            message: error.message
        } );
    } else {

    }

    return res.status( 500 ).send( { message: error.message } );
} )