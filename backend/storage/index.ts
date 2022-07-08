require('dotenv').config()

import { PyrFactory } from "@pyrjs/core";
import { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { AppModule } from "./src/app.module";
import { DatabaseService } from "./src/services/database.service";


const instance = new DatabaseService();

const dbMiddleware = (req: any, res: any, next: any) =>  {
    req.db = instance
    next()
}


PyrFactory.create(8081, AppModule, [dbMiddleware, helmet({ crossOriginEmbedderPolicy: false,}), morgan('tiny'), cors({origin: '*'})]).then((app: Application) => {
    console.log("Your pyrjs app is now running on port: 8080")
})