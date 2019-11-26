process.setMaxListeners(0);
require('dotenv').config();

import chalk from 'chalk';
import { Injector } from './config/inversify.config';
import { TYPES } from "./config/types";
import deleteJWTToken from './routes/logout';
import RemoveResumeHandler from "./routes/removeResume";
import ResumeLinkRequestHandler from "./routes/resumeURLRequest";
import SignUpHandler from "./routes/signup";
/* START ROUTERS */
import UploadResumeHandler from "./routes/upload";


import express = require("express");

import path = require("path")

const cookieParser = require("cookie-parser");

const signin = require('./routes/signin');
/* END ROUTERS  */

const cors = require("cors");
const session = require("express-session")

const bodyParser = require("body-parser");

import { JWTMiddleware } from './middleware/JWTMiddlware';

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

    app.get('/api/checkToken', JWTMiddleware, function (request: express.Request, response: express.Response) {
        console.log(chalk.blue("Calling check token"));

        console.log('Call to check')

        if (response.locals) {
            response.status(200).json({ token: true });
        } else {
            response.status(200).json({ token: false });
        }
    });

    app.post('/api/upload', JWTMiddleware, uploadHandler.handle);

    app.get('/api/getresumeurl', JWTMiddleware, resumeLinkHandler.handle);
    app.get('/api/deleteresume', JWTMiddleware, removeResumeHandler.handle);

    app.post("/api/signup", signUpHandler.handle);
    app.post("/api/signin", signin);

    app.get('/api/logout', deleteJWTToken);

    app.get('*', (request: express.Request, response: express.Response) => {
        console.log(request.url);
        response.sendFile(path.join(__dirname + '/../client/build/index.html'));
    });

    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

setupServer();
