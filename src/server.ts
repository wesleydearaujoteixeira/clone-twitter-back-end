import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import mainRouter from "./routes/mainRouter";

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(urlencoded({ extended: true }));

// usando a mainRouter

server.use(mainRouter);


server.listen(process.env.PORT || 3000, () => {

    if(3000) {
        console.log(`Server is running on port ${process.env.BASE_URL}`);
        return;
    }

    console.log(`Server is running on port ${process.env.BASE_URL}`);
});