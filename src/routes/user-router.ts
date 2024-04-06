import { USER_CONTROLLER } from "@/core/controller/user-controller"
import { verifyAccessToken } from "@/middlewares/user/verify-access-token";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";


export const userRouter = async ( app: FastifyInstance ) => {


    const user = await USER_CONTROLLER();

    app.addHook( 'onRequest', verifyAccessToken )


    //authenticate and create
    app.post( '/:token/user/create', user.create )
    app.post( '/:token/user/authenticate', user.authenticate )


    //profile
    app.get( '/:token/user/profile', { onRequest: [verifyJWT] }, user.profile )

    //personal data
    app.get( '/:token/user/personal-data', { onRequest: [verifyJWT] }, user.getPersonalData )
    app.post( '/:token/user/personal-data', { onRequest: [verifyJWT] }, user.updatePersonalData )

}
