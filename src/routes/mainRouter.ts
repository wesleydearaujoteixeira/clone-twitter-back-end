import { Router } from "express";
import { register } from "../controller/ControllerTwo";

// Instanciando o controller

// Criação da rota com função anônima para garantir o contexto correto
const mainRouter = Router();

// Usando uma função wrapper para chamar o método Register

mainRouter.get('/auth/register', register);


// Certifique-se de usar bind para manter o contexto do "this"

// Exportando as rotas





// mainRouter.post('/auth/login',);
// mainRouter.post('/tweet');
// mainRouter.get('/tweet/:id');
// mainRouter.get('/tweet/:id/answers');
// mainRouter.post('/tweet/:id/like');


// mainRouter.get('/user/:slug');
// mainRouter.post('/user/:slug/tweets');
// mainRouter.post('/user/:slug/follow');
// mainRouter.put('/user');
// mainRouter.post('/user/avatar');
// mainRouter.post('/user/cover');


// mainRouter.get('/feed');
// mainRouter.get('/search');
// mainRouter.get('/trending');
// mainRouter.get('/suggestions');




export default mainRouter;
