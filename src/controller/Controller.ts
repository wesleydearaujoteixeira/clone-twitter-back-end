import { Request, Response } from "express";
import { schemaLoginObject, schemaObject, schemaPOSTObject, schemaQueryObject  } from "../schemas/register";
import { createUser, findUserByEmail, findUserBySlug } from "../services/users";
import slug from "slug";
import { compare, hashSync } from "bcrypt-ts";
import { createToken } from "../../model/utils/create-token-slug"
import { ExtendRequest } from "../../model/utils/types/extended-request";
import { findTwitter, createTwetter, addHashtag, 
    findAnswersFromTweet, 
    GetLikedService,
    unlikeTweet,
    likeTweet, 
    followTweet,
    followTweetTwo,
    getTweetFollowers,
    getTweetServices} from "../services/twetter";





export default class Controller {

    static async register(req: Request, res: Response): Promise<any> {

        try {
            const safeDATA = schemaObject.safeParse(req.body);
    
            if (!safeDATA.success) {
                return res.status(400).json({ errors: safeDATA.error.flatten().fieldErrors });
            }
    
            const { email, name, password } = safeDATA.data;
    
            // Verifica se o email já existe
            const hasEmail = await findUserByEmail(email);
            if (hasEmail) {
                return res.status(400).json({ error: 'E-mail já existe, por favor cadastre outro e-mail!' });
            }
    
            // Geração do slug
            let userSlug = slug(name);
            let slugSuffix = 0;
    
            while (await findUserBySlug(userSlug)) {
                slugSuffix++;
                userSlug = slug(`${name}-${slugSuffix}`);
            }
    
            // Hash da senha
            const hashPassword = hashSync(password, 10);
    
            // Criação do novo usuário
            const newUser = await createUser({
                name,
                email,
                slug: userSlug,
                password: hashPassword,
            });
    
            
            const token =  createToken(userSlug); 
            
            
            // Envio da resposta de sucesso
            return res.status(201).json({
                message: 'Usuário criado com sucesso!',
                token,
                user: {
                    name: newUser.name,
                    slug: newUser.slug,
                    avatar: newUser.avatar,
                },
            });
        } catch (error) {
            // Pode ser útil diferenciar os erros
            console.error(error); // Log do erro para depuração
            return res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
        }
    }

    static async login(req: Request, res: Response): Promise<any> {

        try {
          
            const safeDATA = schemaLoginObject.safeParse(req.body);

            if (!safeDATA.success) {
                return res.status(400).json({ errors: safeDATA.error.flatten().fieldErrors });
            }
            
            const user = await findUserByEmail(safeDATA.data.email);

            if(!user) {
                return res.status(401).json({ error: "Email ou senha inválidos"});
            }

            const isPasswordValid = await compare(safeDATA.data.password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: "Email ou senha inválidos" });
            }

            const token = createToken(user.slug);

            return res.status(200).json(
                {
                    message: "Login efetuado com sucesso!",
                    token,
                    user: {
                        name: user.name,
                        slug: user.slug,
                        avatar: user.avatar,
                    },
                }
            )

        }catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor" + error });

        }

    }

    static async pong(req: ExtendRequest, res: Response): Promise<any> {
        res.json({
            message: "Pong",
            slug: req.userSlug
        })
    }


    static async TweeterPost(req: ExtendRequest, res: Response): Promise<any> {
        
        try {
            const safeDATA = schemaPOSTObject.safeParse(req.body);
    
            if (!safeDATA.success) {
                return res.status(400).json({ errors: safeDATA.error.flatten().fieldErrors });
            }

            if(safeDATA.data.answer) {
                const hasAnswer = await findTwitter(Number(safeDATA.data.answer));

                if(!hasAnswer) {
                    return res.status(404).json({ error: " Tweeter Inexistente! " });
                }

            }
    

            const newTwetter = await createTwetter(
                req.userSlug as string,
                safeDATA.data.body,
                safeDATA.data.answer? parseInt(safeDATA.data.answer) : 0
            
            );

            const hasthag = safeDATA.data.body.match(/#[a-zA-Z0-9_]+/g);

            if(hasthag) {

                for(let tag of hasthag) {

                    if(tag.length >= 2) {
                        await addHashtag(tag);
                    }
                 
                    
                }
            }


            return res.json({
                message: "Tweet criado com sucesso!",
                tweet: newTwetter,
            });

            
            
        } catch (error) {
            
        }
}

    static async TweeterGetId(req: ExtendRequest, res: Response): Promise<any> {

        const { id } = req.params;

        const tweet = await findTwitter(parseInt(id));
        
        if(!tweet) {
            return res.status(404).json({ error: "Tweet Inexistente! " });
        }

        return res.json({
            message: "Tweet Encontrado!",
            tweet,
        });

    }

    static async getAnswers(req: ExtendRequest, res: Response): Promise<any> {

        const {id} = req.params;

        const answer = await findAnswersFromTweet(parseInt(id));

        res.status(200).json({ answer });

    }
    
    static async isLiked (req: ExtendRequest, res: Response): Promise<any> 
    
    {

       try {
        const liked = await GetLikedService(
            req.userSlug as string,
            parseInt(req.params.id)
        );

        if(liked) { 
            unlikeTweet(
                req.userSlug as string,
                parseInt(req.params.id)
            )

            return res.status(200).json({
                message: "Tweet deslikado com sucesso!",
            });

        }else {
            likeTweet(
                req.userSlug as string,
                parseInt(req.params.id)
            )

            return res.status(200).json({
                message: "Tweet likado com sucesso!",
            });
        }



       } catch (error) {
            return res.status(500).json({error})
       }

    }

    static async userByIslug(req: ExtendRequest, res: Response): Promise<any> {
            const { islug } = req.params

            const user = await findUserBySlug(islug);

            if(!user) {
                return res.status(404).json({ error: "Usuário não encontrado! " });
            }



            const countTweet = await followTweet(user.slug);
            const countFollowing = await followTweetTwo(user.slug);
            const total = await getTweetFollowers(user.slug);


            return res.json({
                message: "Usuário Encontrado!",
                user,
                information: {
                    tweet: countTweet,
                    following: countFollowing,
                    total,
                }
            });

    }

    static async TweetUser(req: ExtendRequest, res: Response): Promise<any> {
        
        const { slug } = req.params;
        
        try{

            const safeDATA = schemaQueryObject.safeParse(req.query);
    
            if (!safeDATA.success) {
                return res.status(400).json({ errors: safeDATA.error.flatten().fieldErrors });
            }

            let perPage = 2;
            let currentPage = safeDATA.data.page ?? 0;
            const tweetGet = await getTweetServices(slug, currentPage, perPage);

            return res.status(200).json({ 
                message: "Tweets Encontrados!",
                tweetGet,
                currentPage,
                perPage,
            });

        }catch(error){
            return res.status(404).json({ errors: "Nenhum encontrados"});
        }
    

    }





}