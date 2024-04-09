import { CLIENT_BUSINESS } from "@/core/business/client-business";
import { USER_BUSINESS } from "@/core/business/user-business"
import { CLIENT_DATABASE } from "@/core/database/client-database";
import { USER_DATABASE } from "@/core/database/user-database";

export const makeClientFactory = () => {

    const clientDatabase = new CLIENT_DATABASE();

    const clientBusiness = new CLIENT_BUSINESS( clientDatabase );
    return clientBusiness;

}