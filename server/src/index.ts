require('dotenv').config();

import { TYPES } from "./config/types";
import chalk from 'chalk'

import { Injector } from './config/inversify.config';
/* START ROUTERS */
import UploadResumeHandler from "./routes/upload";
import SignUpHandler from "./routes/signup";
import ResumeLinkRequestHandler from "./routes/resumeURLRequest";
import RemoveResumeHandler from "./routes/removeResume";

import deleteJWTToken from './routes/logout';
import express = require("express");

import path = require("path")

const cookieParser = require("cookie-parser");

const signin = require('./routes/signin');
/* END ROUTERS  */

const cors = require("cors");
const session = require("express-session")

const bodyParser = require("body-parser");

const jwtMiddleware = require('./middleware/JWTMiddlware');

let corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

const PORT: number = 8000;
const app: express.Express = express();

const uploadHandler: UploadResumeHandler = Injector.get<UploadResumeHandler>(TYPES.UploadResumeHandler);
const signUpHandler: SignUpHandler = Injector.get<SignUpHandler>(TYPES.SignUpHandler);
const resumeLinkHandler: ResumeLinkRequestHandler = Injector.get<ResumeLinkRequestHandler>(TYPES.ResumeLinkRequestHandler);
const removeResumeHandler: RemoveResumeHandler = Injector.get<RemoveResumeHandler>(TYPES.RemoveResumeHandler);

/**
 * Sets up server, cords, body-parser,
 *  and routes. Also starts server
 */
const setupServer = () => {
    app.use(bodyParser.json());

    app.use(express.static(path.join(__dirname, '/../client/build')));

    app.use(cookieParser());
    app.use(cors(corsOptions));

    app.get('/api/checkToken', jwtMiddleware, function (request: express.Request, response: express.Response) {
        console.log(chalk.blue("Calling check token"));

        if (response.locals) {
            response.status(200).json({ token: true });
        } else {
            response.status(200).json({ token: false });
        }

    });

    app.post('/api/upload', jwtMiddleware, uploadHandler.handle);

    app.get('/api/getresumeurl', jwtMiddleware, resumeLinkHandler.handle);
    app.get('/api/deleteresume', jwtMiddleware, removeResumeHandler.handle);

    app.post("/api/signup", signUpHandler.handle);
    app.post("/api/signin", signin);

    app.get('/api/logout', deleteJWTToken);

    app.get('*', (request: express.Request, response: express.Response) => {
        console.log(request.url);
        response.sendFile(path.join(__dirname + '/../client/build/index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

setupServer();
