import { Body, Controller, Delete, Get, Param, Post, Req, Res, Next } from "@pyrjs/core";
import {expressjwt} from "express-jwt";
import { DatabaseService } from "../services/database.service";
import {Response, Request} from 'express'
import { Bucket } from "../model/Bucket";
import { BucketObject } from "../model/BucketObject";
import multer from 'multer'
import Path from 'path';
import fs from 'fs';


const _storage = multer.diskStorage({
    destination: async (req: any, file, callback) => {


        const bucket = req.params.bucket;

        // bucket check 

        const em = req.db.em;

        const bucketRepo = em.getRepository(Bucket);

        if(await bucketRepo.count({key: bucket}) <= 0){
            return callback(new BucketNotFoundError("bucket does not exist!"), null)
        }

        
        const path = req.params['0'];

        const paths = path.split("/");

        const actualFile = paths.pop();
        
        const storagePath = Path.join("./", process.env.BUCKET_STORAGE_ROOT_DIR, bucket, ...paths)

        fs.mkdirSync(storagePath, {recursive: true})

        callback(null, storagePath)

    },
    filename: (req, file, callback) => {

        const path = req.params['0'];

        const paths = path.split("/");

        const actualFile = paths.pop();
        
        callback(null, actualFile)
    }
})

const _upload = multer({storage: _storage}).single("file")

@Controller("/bucket", [
    expressjwt({ secret: process.env.JWT_KEY, algorithms: ["HS256"] }),
  ])
export class BucketController{



    constructor(){

    }

    @Post("/")
    public async createNewBucket(@Body() body: NewBucket, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){
        try{
            const em = request.db.em;

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
    public async getBucketInfo(@Param("bucket") bucket: string, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){
        try{
            const em = request.db.em;

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

    @Get("/:bucket/*")
    public async getFromBucket(@Param("path") path: string, @Param("bucket") bucket: string, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){

        try{
            const em = request.db.em;

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

    @Delete("/:bucket/*")
    public async deleteFromBucket(@Param("path") path: string, @Param("bucket") bucket: string, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){

        try{
            const em = request.db.em;

            const bucketObjectRepo = em.getRepository(BucketObject);

            const bucketRef = em.getReference(Bucket, bucket as any)

            await bucketObjectRepo.removeAndFlush({key: path, bucket: bucketRef})

            return res.status(200).json({success: true})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to delete object!'})
        }

    }

    @Post("/:bucket/*")
    public async uploadToBucket(@Param('bucket') bucket: string, @Next() next: any, @Res() response: Response, @Req() request: Request & {db: DatabaseService}){

                _upload(request, response, async (err: any) => {

                    try{

                        if (err instanceof BucketNotFoundError) {
                            next(err)
                            return response.status(404).json({success: false, err: 'bucket does not exist!'})
                        }else if (err){
                            throw err
                        }

                        const em = request.db.em;
            
                        const bucketObjectRepo = em.getRepository(BucketObject);

                        const bucketRef = em.getReference(Bucket, bucket as any)
                        const newObject = new BucketObject()

                        newObject.bucket = bucketRef;
                        newObject.uploaded = new Date();
                        newObject.filesize = request.file.size;
                        newObject.key = request.file.path

                        bucketObjectRepo.persistAndFlush(newObject)


                        next()
                    }catch(err){
                        next(err)
                        response.status(500).json({success: false, err: 'failed to upload object!'})
                    }

                });
    }


    

}


export interface NewBucket{
    key: string
    public: boolean
}


export class BucketNotFoundError extends Error{

}