require('dotenv').config()

import { PyrFactory } from "@pyrjs/core";
import { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { AppModule } from "./src/app.module";

PyrFactory.create(8081, AppModule, [helmet({ crossOriginEmbedderPolicy: false,}), morgan('tiny'), cors({origin: '*'})]).then((app: Application) => {
    console.log("Your pyrjs app is now running on port: 8080")
})