import { PRISMA } from "@/data-providers/prisma"
import { CustomError } from "@/entities/custom-error";
import { Prisma, User, PersonalData } from "@prisma/client";


type UserWithoutPassword = Omit<User, 'password' | 'client_id' | 'role'>


export class USER_DATABASE {

    async create( data: Prisma.UserCreateInput, clientId: string ): Promise<void> {

        await PRISMA.user.create( {
            data: {
                email: data.email,
                password: data.password,
                username: data.username,
                client_id: clientId
            }
        } )
    }

    async findByUsername( username: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                username_client_id: {
                    username,
                    client_id: clientId
                }
            }
        } )
        return user;
    }

    async findByEmail( email: string, clientId: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                email_client_id: {
                    email,
                    client_id: clientId
                }
            }
        } )
        return user;
    }

    async findById( id: string ): Promise<User | null> {
        const user = await PRISMA.user.findUnique( {
            where: {
                id
            }
        } )
        return user;
    }

    async profile( userId: string, clientId: string ): Promise<UserWithoutPassword | null> {

        const user = await PRISMA.user.findFirst( {
            where: {
                AND: [
                    { id: userId },
                    { client_id: clientId }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
            }
        } );


        return user;
    }

    async getPersonalData( userId: string ): Promise<PersonalData | null> {

        const personalData = await PRISMA.personalData.findFirst( {
            where: {
                user_id: userId
            }
        } )
        return personalData;
    }

    async savePersonalData( userId: string, data: any ): Promise<void> {


        const user = await PRISMA.user.findUnique( { where: { id: userId } } );
        if ( !user ) {
            throw new Error( 'User not found' );
        }

        const personalData = await PRISMA.personalData.findUnique( { where: { user_id: userId } } );
        if ( personalData ) {
            await PRISMA.personalData.update( {
                where: { user_id: userId },
                data: {
                    ...data,
                    user_id: userId
                },
            } )
        } else {
            await PRISMA.personalData.create( {
                data: {
                    ...data,
                    user_id: userId
                },
            } )
        }
    }
    // async savePersonalData( userId: string, data: Prisma.PersonalDataCreateInput ): Promise<void> {
    //     await PRISMA.personalData.create( {

    //         data: {
    //             ...data,
    //             user: {
    //                 connect: {
    //                     id: userId
    //                 }
    //             }
    //         }

    //     } )
    // }

}