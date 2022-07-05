import { Body, Controller, Delete, Get, Param, Post, Res } from "@pyrjs/core";
import {expressjwt} from "express-jwt";
import { DatabaseService } from "../services/database.service";
import {Response} from 'express'
import { Bucket } from "../model/Bucket";
import { BucketObject } from "../model/BucketObject";

@Controller("/bucket", [
    expressjwt({ secret: process.env.JWT_KEY, algorithms: ["HS256"] }),
  ])
export class BucketController{

    constructor(private database: DatabaseService){

    }

    @Post("/")
    public async createNewBucket(@Body() body: NewBucket, @Res() res: Response){
        try{
            const em = this.database.em;

            const bucketRepo = em.getRepository(Bucket);

            if(await bucketRepo.count({key: body.key}) > 0){
                return res.status(400).json({success: false, err: 'a bucket with that key already exists'})
            }

            const bucket = new Bucket()

            bucket.created = new Date()
            bucket.key = body.key
            bucket.public = body.public

            await bucketRepo.persistAndFlush(bucket)

            return res.status(200).json({success: true, data: bucket})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to create bucket!'})
        }
    }

    @Get("/:bucket/")
    public async getBucketInfo(@Param("bucket") bucket: string, @Res() res: Response){
        try{
            const em = this.database.em;

            const bucketRepo = em.getRepository(Bucket);

            const dbBucket = await bucketRepo.findOne({key: bucket}, {populate: ['objects']})

            if(!dbBucket){
                return res.status(404).json({success: false, err: `bucket with key ${bucket} does not exist`})
            }

            return res.status(200).json({success: true, data: dbBucket})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to get bucket!'})
        }
    }

    @Get("/:bucket/:path*")
    public async getFromBucket(@Param("path") path: string, @Param("bucket") bucket: string, @Res() res: Response){

        try{
            const em = this.database.em;

            const bucketObjectRepo = em.getRepository(BucketObject);

            const bucketRef = em.getReference(Bucket, bucket as any)

            const dbBucketObject = await bucketObjectRepo.findOne({key: path, bucket: bucketRef})

            if(!dbBucketObject){
                return res.status(404).json({success: false, err: `object with key ${bucket} does not exist`})
            }

            return res.status(200).json({success: true, data: dbBucketObject})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to get object!'})
        }

    }

    @Delete("/:bucket/:path*")
    public async deleteFromBucket(@Param("path") path: string, @Param("bucket") bucket: string, @Res() res: Response){

        try{
            const em = this.database.em;

            const bucketObjectRepo = em.getRepository(BucketObject);

            const bucketRef = em.getReference(Bucket, bucket as any)

            await bucketObjectRepo.removeAndFlush({key: path, bucket: bucketRef})

            return res.status(200).json({success: true})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to delete object!'})
        }

    }

}


export interface NewBucket{
    key: string
    public: boolean
}