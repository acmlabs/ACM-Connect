process.setMaxListeners(0);
require('dotenv').config();

import { Injector } from '../../config/inversify.config';
import RecruiterCreator, { Recruiter } from "./Recruiter";

const main = async () => {
    const symbol: symbol = Symbol.for("RecruiterCreator")
    Injector.bind<RecruiterCreator>(symbol).to(RecruiterCreator);

    const recruiterCreator = Injector.get<RecruiterCreator>(symbol);

    const recruiter: Recruiter = {
        email: 'abc@gmail.com',
        company: 'ABC Corp',
        dateCreated: Date.now().toString(),
        password: 'abc123'
    }

    recruiterCreator.addRecruiterProfile(recruiter)
};

main();
