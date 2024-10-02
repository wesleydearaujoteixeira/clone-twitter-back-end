import { type Prisma } from '@prisma/client'
import { getPublicUrl } from "../../model/getPublicUrl";
import { prisma } from "../../model/prisma"

 
export const findUserByEmail = async (email: string) => {

    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    });


    if(user) {
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover)
        }
    }

    return null;



}



export const findUserBySlug = async (slug: string) => {

    

    const user = await prisma.user.findFirst({
        select: {
            avatar: true,
            cover: true,
            slug: true,
            name: true,
            bio: true,
            link: true
        },
        where: {
            slug,
        }
    });

    if(user) {
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover)
        }
    }

    return null;


}

interface User {
    slug: string;
    name: string;
    email: string;
    password: string;
}




export const createUser = async (data: User) => {

   


    const user = await prisma.user.create({
        data: {
            slug: data.slug,
            name: data.name,
            email: data.email,
            password: data.password,
        
        }
    });

    return {
        ...user,
        avatar: getPublicUrl(user.avatar),
        cover: getPublicUrl(user.cover)
    }

}