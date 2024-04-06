import { ADMIN_BUSINESS } from "@/core/business/admin-business";
import { ADMIN_DATABASE } from "@/core/database/admin-databanse";


export const makeAdminFactory = () => {

    const adminDatabase = new ADMIN_DATABASE();

    const adminBusiness = new ADMIN_BUSINESS( adminDatabase );
    return adminBusiness;

}