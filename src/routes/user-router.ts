import { USER_CONTROLLER } from "@/core/controller/user-controller"
import { FastifyInstance } from "fastify";


export const userRoutes = async ( app: FastifyInstance ) => {

    const user = await USER_CONTROLLER();


    app.post( '/user/create', user.create )
    app.post( '/user/authenticate', user.authenticate )


}