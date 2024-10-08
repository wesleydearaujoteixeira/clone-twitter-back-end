import { z } from "zod";

export const schemaObject = z.object({
    name: z.string({ message: " Nome é obrigatório "}).min(2, 'no minimo 2 caracteres'),
    email: z.string({ message: " Email é obrigatório "}).email('E-mail inválido'),
    password: z.string({ message: "senha é obrigatória "}).min(4, "precisa ser de no mínimo 4 digitos"),
});

export const schemaLoginObject = z.object({
    email: z.string({ message: " Email é obrigatório "}).email('E-mail inválido'),
    password: z.string({ message: "senha é obrigatória "}).min(4, "precisa ser de no mínimo 4 digitos"),
});


export const schemaPOSTObject = z.object({
    body: z.string({ message: "É necessário um corpo para os comentarios "}),
    answer: z.string().optional()
});

export const schemaQueryObject = z.object({
    page: z.coerce.number().min(0).optional()
});