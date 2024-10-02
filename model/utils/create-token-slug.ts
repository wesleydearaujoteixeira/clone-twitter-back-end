import  jwt  from "jsonwebtoken";
export const createToken = (slug: string ) => jwt.sign({slug}, process.env.SECRET_KEY as string);

