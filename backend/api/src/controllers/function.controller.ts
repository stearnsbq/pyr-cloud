import { Body, Controller, Post, Res } from "@pyrjs/core";
import { Function, Runtime } from "../model/Function";
import { DatabaseService } from "../services/database.service";
import {Response} from 'express';


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