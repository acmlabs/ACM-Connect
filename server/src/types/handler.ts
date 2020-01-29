import express = require('express')

export default interface Handler {
    handle: (request: express.Request, response: express.Response) => Promise<void>
}