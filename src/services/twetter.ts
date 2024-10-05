import { getPublicUrl } from "../../model/getPublicUrl";
import { prisma } from "../../model/prisma"

export const findTwitter = async (id: number) => {

    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },

            likes: {
                select: {
                    userSlug: true,
                }
            }
        },
        where: { id }
    });


    if(tweet) {
        tweet.user.avatar = getPublicUrl(tweet.user.avatar);
        return tweet;
    }

    return null;



}

export const createTwetter = async (slug: string, body: string, answer?: number) => {

    const tweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug ,
            answerOf: answer ?? 0,

        }
    });

    return tweet;

}


export const addHashtag = async (hashtag: string) => {
    const hs = await prisma.trend.findFirst({
        where: { hastag: hashtag }
    });

    if(hs) {
        await prisma.trend.update({
            where: { id: hs.id },
            data: {counter: hs.counter + 1, updateAt: new Date()}, 
    });
    

    }else {
        await prisma.trend.create({
            data: { hastag: hashtag},
        });
    }


}


export const findAnswersFromTweet = async (id: number) => {
  
    const answers = await prisma.tweet.findMany({

        include: {

            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },

            likes: {
                select: {
                    userSlug: true,
                }
            },

        },


        where: { answerOf: id },
    });



    for(let tweetIndex in answers){
        answers[tweetIndex].user.avatar = getPublicUrl(answers[tweetIndex].user.avatar);

    }


    return answers;


}

export const GetLikedService = async (userSlug: string, id: number) => {

    const likedOn = await prisma.tweetLikes.findFirst({
        where: { 
            userSlug: userSlug,
            tweetId: id
         },
        
    });

    return likedOn ? true : false;



}

export const unlikeTweet = async (userSlug: string, id: number) => { 
        await prisma.tweetLikes.deleteMany({
            where: { userSlug, tweetId: id }
        });
}

export const likeTweet = async (userSlug: string, id: number) => { 
    await prisma.tweetLikes.create({
        data: { userSlug, tweetId: id}
    });
}