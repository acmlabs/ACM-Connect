# ACM Connect

## What is this

- `ACM Connect` is now the best way UT Dallas students can join ACM @ UTD
- We launched an initiative to help students get more exposure to recruiters and increase the chances of getting internships and jobs after graduation
- The front-end is built in `React` and the backend in `Node.js` with `TypeScript`

## Cloning the repo

- Run `git clone https://github.com/acmlabs/ACM-Connect`
- `cd ACM-Connect`
- `npm i` to install the required dependencies
- `npm run tsrun` to run the server and deploy the site

## External dependencies

- ACM Connect stores the resumes on `AWS S3` and uses `AWS DynamoDB` for account management
- You'll should install the AWS CLI from [here](`https://aws.amazon.com/cli/`).

## Running the server

- If you'd like to test using the UTD account, you'll need to request a key login pair from `aneeshsaripalli@gmail.com`
- Else you can run the server against your own resources by modifying the `.env` file and changing the resource names
- WORK IN PROGRESS ^^
- You can start the server and deploy the site by doing `cd server && npm run dev`
- `npm run dev` compiles and watches the server directory for changes and points the static file directory to `server/client/build`.
- Compile changes to the front-end by using `npm run build` in `server/client`

## Contributing
- Being a ACM Labs project, ACM Connect will be open source software
- I'll try and set up a way of contributing soon

## Contact
- Email `aneeshsaripalli@gmail.com` if you have any questions / concerns.
