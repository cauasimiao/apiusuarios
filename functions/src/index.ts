//import libraries
import * as functions from "firebase-functions";
import * as express from 'express';
import { userRouter } from "./router";

const main = express();

main.use('/api/v1/users', userRouter);

export const webApi = functions.https.onRequest(main);