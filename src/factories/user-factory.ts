import { USER_BUSINESS } from "@/core/business/user-business"
import { USER_DATABASE } from "@/core/database/user-database";

export const makeUserFactory = () => {

    const userDatabase = new USER_DATABASE();

    const userBusiness = new USER_BUSINESS( userDatabase );
    return userBusiness;

}