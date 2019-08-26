import jwt from 'jsonwebtoken';
import express from "express";
import chalk from 'chalk'

const SECRET: string = process.env.SECRET!;

// middleware function to check for logged-in users
const verifyJWTToken = (request: express.Request, response: express.Response, next: any) => {
    const token: string | undefined =
        request.body.token ||
        request.query.token ||
        request.headers['x-access-token'] ||
        request.cookies.token;

    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                response.status(401).send('Unauthorized: Invalid token');
            } else {
                // @ts-ignore
                console.log(chalk.green(`Recognized JWT, signing in user email ${decoded.email}, id ${decoded.uid}`));
                // @ts-ignore
                response.locals.email = decoded.email;
                // @ts-ignore
                response.locals.uid = decoded.uid;
                next();
            }
        });
    }
};
module.exports = verifyJWTToken;