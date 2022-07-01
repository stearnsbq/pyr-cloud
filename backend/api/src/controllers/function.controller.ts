import { Body, Controller, Post, Res } from "@pyrjs/core";
import { Function, Runtime } from "../model/Function";
import { DatabaseService } from "../services/database.service";
import {Response} from 'express';
import Path from 'path';


@Controller("/function")
export class FunctionController{

    constructor(private db : DatabaseService){

    }


    @Post("/")
    public async createNewFunction(@Body() body: NewFunction, @Res() response: Response){

        try{
            const functionRepo = this.db.em.getRepository(Function);

            const newFunction = new Function();

            newFunction.name = body.name;
            newFunction.created = new Date();
            newFunction.runtime = body.runtime;

            // setup the code environment

            const environmentsPath = Path.resolve(__dirname, "environments")

            switch(body.runtime){
                case Runtime.NODEJS:{

                    const path = Path.join(environmentsPath, 'nodejs', 'base-function')

                    break;
                }
                case Runtime.PYTHON:{

                    const path = Path.join(environmentsPath, 'pytrhon', 'base-function')

                    break;
                }
                default:{
                    return response.status(400)
                }
                
            }



            functionRepo.persistAndFlush(body);

            return response.status(200).json({success: true, data: newFunction})
        }catch(err){
            return response.status(500).json({success: false, err: 'failed to create a new function'})
        }

    }
    
}


export interface NewFunction{
    name: string,
    runtime: Runtime,
}