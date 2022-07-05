import { Controller, Param, Post, Req, Res } from "@pyrjs/core";
import {Response, Request} from 'express'

@Controller("/bucket")
export class AuthController{
    

    constructor(){

    }


    @Post("/:bucket/:path*")
    public async uploadObject(@Param('bucket') bucket: string, @Param('path') path: string, @Res() response: Response, @Req() request: Request ){
        try{

        }catch(err){
            return response.status(500).json({success: false, err: 'failed to upload object!'})
        }
    }


}