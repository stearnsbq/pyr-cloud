import { Body, Controller, Post, Res } from "@pyrjs/core";
import {Response} from 'express';
import { User } from "../model/User";
import {hash, verify} from "argon2";
import jwt from 'jsonwebtoken';
import { DatabaseService } from "../services/database.service";


@Controller("/auth")
export class AuthController{

    constructor(private db: DatabaseService){

    }

    @Post("/login")
    public async login(@Body() body: Login, @Res() response: Response){

        try{

            const userRepo = this.db.em.getRepository(User);

            const user = await userRepo.findOne({username: body.username});
    
            if(!user || !(await verify(user.password, body.password))){
                return response.status(401).json({success: false, err: "Invalid username or password"})
            }
    
            user.lastLogin = new Date();
    
            userRepo.persistAndFlush(user);
    
            const token = jwt.sign({username: user.username}, process.env.JWT_KEY);
    
            return response.status(200).json({success: true, data: token})

        }catch(err){
            return response.status(500).json({success: false, err: JSON.stringify(err)})
        }

    }

    @Post("/register")
    public async register(@Body() body: Register, @Res() response: Response){

        try{

            const userRepo = this.db.em.getRepository(User);

            const newUser = new User();
    
            newUser.username = body.username;

            newUser.password = await hash(body.password);
            newUser.lastLogin = new Date()
    
            userRepo.persistAndFlush(newUser)

            return response.status(200).json({success: true});
        }catch(err){
            return response.status(500).json({success: false, err: JSON.stringify(err)})
        }

    }

}

export interface Login{
    username: string,
    password: string
}


export interface Register{
    username: string,
    password: string
}