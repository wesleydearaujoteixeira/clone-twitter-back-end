import { Router } from "express";
import Controller from "../controller/Controllers";


// instanciando o controller 
const ControllerRoutes = new Controller;

// criação da rota;
const mainRouter =  Router();


mainRouter.get('/home', ControllerRoutes.Home);
mainRouter.post('/teste', ControllerRoutes.Post);

export default mainRouter;