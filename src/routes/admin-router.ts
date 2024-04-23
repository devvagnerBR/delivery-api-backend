import { ADMIN_CONTROLLER } from "@/core/controller/admin-controller";
import { verifyAdminRole } from "@/middlewares/admin/verify-admin-role";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";


export const adminRoutes = async ( app: FastifyInstance ) => {

    const admin = await ADMIN_CONTROLLER();

    app.post( '/client/:token/create', { onRequest: [verifyJWT, verifyAdminRole] }, admin.registerNewClient )
    // app.post( '/client/:token/create', { onRequest: [verifyJWT, verifyAdminRole] }, admin.registerNewClient )
    // app.post( '/user/create', user.create )
    // app.post( '/user/authenticate', user.authenticate )


}