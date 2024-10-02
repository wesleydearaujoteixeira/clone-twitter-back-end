import { z } from "zod";

export const schemaObject = z.object({
    name: z.string({ message: " Nome é obrigatório "}).min(2, 'no minimo 2 caracteres'),
    email: z.string({ message: " Email é obrigatório "}).email('E-mail inválido'),
    password: z.string({ message: "senha é obrigatória "}).min(4, "precisa ser de no mínimo 4 digitos"),
});


