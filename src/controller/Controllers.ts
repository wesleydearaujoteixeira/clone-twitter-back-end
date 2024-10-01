import { Request, Response } from "express";


export default class Controller {

    Home (req: Request, res: Response,): void {
        res.send('funcionando...');
    }

    Post (req: Request, res: Response): void {
        
        const { nome, comments } = req.body;

        res.status(200).json({
            message: 'Novo comentário adicionado!',
            nome: nome,
            comments: comments
        })

    }

}