import { Request, RequestHandler, Response } from "express"
import { schemaObject } from "../schemas/register";
import { createUser, findUserByEmail, findUserBySlug } from "../services/users";
import slug from "slug";
import { hashSync } from "bcrypt-ts";

export const register = async (req:Request, res: Response) => {
    
    const safeDATA = schemaObject.safeParse(req.body);

    // Se a validação falhar, retorne uma resposta de erro
    if (!safeDATA.success) {
        return res.status(400).json({ errors: safeDATA.error.flatten().fieldErrors });
    }

    // Prossiga apenas se safeDATA.data estiver definido
    if (safeDATA.data) {
        const hasEmail = await findUserByEmail(safeDATA.data.email);
        if (hasEmail) {
            return res.status(400).json({ error: 'E-mail já existe, por favor cadastre outro e-mail!' });
        }

        // Verifique o slug
        let genSlug = true;
        let userSlug = slug(safeDATA.data.name);

        while (genSlug) {
            const hasSlug = await findUserBySlug(userSlug);
            if (hasSlug) {
                let slugSuffix = Math.floor(Math.random() * 99999).toString();
                userSlug = slug(safeDATA.data.name + slugSuffix);
            } else {
                genSlug = false;
            }
        }

        const hashPassword = hashSync(safeDATA.data.password, 10);
        const newUser = await createUser({
            name: safeDATA.data.name,
            email: safeDATA.data.email,
            slug: userSlug,
            password: hashPassword,
        });

        // Crie o token (implemente a lógica de geração de token, se necessário)
        let token = ''; // Substitua pela lógica de geração de token, se aplicável

        // Envie a resposta de sucesso
        return res.status(201).json({
            message: 'Usuário criado com sucesso!',
            token,
            user: {
                name: newUser.name,
                slug: newUser.slug,
                avatar: newUser.avatar,
            },
        });
    }
    return res.status(400).json({ error: "Dados não válidos" });


}