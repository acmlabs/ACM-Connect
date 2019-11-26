import express from "express";
import chalk from "chalk";

const deleteJWTToken = (request: express.Request, response: express.Response, next: any) => {
    const token: string | undefined =
        request.body.token ||
        request.query.token ||
        request.headers['x-access-token'] ||
        request.cookies.token;

    chalk.red("User is logging out");

    if (token) {
        response.cookie('token', {expires: Date.now()});
        response.sendStatus(200);
    } else {
        response.sendStatus(500);
    }
};
export default deleteJWTToken;
