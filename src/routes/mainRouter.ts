import { Router } from "express";
import Controller from "../controller/Controller";
import  VerificationService  from "../../model/utils/verifyToken";


const mainRouter = Router();

mainRouter.post('/auth/register', Controller.register);
mainRouter.post('/auth/login', Controller.login);
mainRouter.get('/ping', VerificationService.getVerification, Controller.pong);
mainRouter.post('/tweet', VerificationService.getVerification, Controller.TweeterPost);
mainRouter.get('/tweet/:id', VerificationService.getVerification, Controller.TweeterGetId);
mainRouter.get('/tweet/:id/answers', VerificationService.getVerification, Controller.getAnswers);
mainRouter.post('/tweet/:id/like' , VerificationService.getVerification, Controller.isLiked);
mainRouter.get('/user/:slug', VerificationService.getVerification, Controller.userByIslug);
mainRouter.get('/user/:slug/tweets', VerificationService.getVerification, Controller.TweetUser );
// mainRouter.post('/user/:slug/follow');
// mainRouter.put('/user');
// mainRouter.post('/user/avatar');
// mainRouter.post('/user/cover');


// mainRouter.get('/feed');
// mainRouter.get('/search');
// mainRouter.get('/trending');
// mainRouter.get('/suggestions');




export default mainRouter;
