process.setMaxListeners(0);
require('dotenv').config();

import { Injector } from '../config/inversify.config';
import { TYPES } from "../config/types";
import KeyGen, { Payload } from "./keys/KeyGen";
import chalk from 'chalk';

const fs = require('fs')

const main = async (keys: number) => {
  const keyGen = Injector.get<KeyGen>(TYPES.KeyGen);

  const tokens: Array<String> = []

  console.log(chalk.blue('Generating keys...'))
  for (let i: number = 0; i < keys; ++i) {
    const payload: Payload = await keyGen.generateKey();
    console.log(chalk.green(payload.token));

    tokens.push(payload.token);
  }

  fs.writeFileSync('./tokens.json', JSON.stringify(tokens));
};

if (process.argv.length != 3) {
  console.log("node index.js <number of keys>");
  process.exit(-1);
}

const keys: number = +process.argv[2]
main(keys);
