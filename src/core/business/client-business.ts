import { Prisma } from "@prisma/client";
import *  as bcrypt from 'bcryptjs';
import { env } from "@/env";
import { CustomError } from "@/entities/custom-error";
import { CLIENT_DATABASE } from "../database/client.database";

export class CLIENT_BUSINESS {


    constructor(
        private clientDatabase: CLIENT_DATABASE
    ) { }

    



}