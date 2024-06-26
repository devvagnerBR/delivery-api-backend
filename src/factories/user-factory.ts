import { USER_BUSINESS } from "@/core/business/user-business"
import { CLIENT_DATABASE } from "@/core/database/client-database";
import { USER_DATABASE } from "@/core/database/user-database";

export const makeUserFactory = () => {

    const userDatabase = new USER_DATABASE();
    const clientDatabase = new CLIENT_DATABASE();

    const userBusiness = new USER_BUSINESS( userDatabase, clientDatabase );
    return userBusiness;

}