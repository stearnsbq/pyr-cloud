import { Body, Controller, Delete, Get, Param, Post, Req, Res, Next, Query } from "@pyrjs/core";
import {expressjwt} from "express-jwt";
import { DatabaseService } from "../services/database.service";
import {Response, Request} from 'express'
import { Bucket } from "../model/Bucket";
import { BucketObject } from "../model/BucketObject";
import multer from 'multer'
import Path from 'path';
import fs from 'fs';
import { EntityManager } from "@mikro-orm/core";


const _storage = multer.diskStorage({
    destination: async (req: any, file, callback) => {

        const bucket = req.params.bucket;

        // bucket check 

        const em = req.db.em as EntityManager;

        const bucketRepo = em.getRepository(Bucket);

        if(await bucketRepo.count({key: bucket}) <= 0){
            return callback(new BucketNotFoundError("bucket does not exist!"), null)
        }


        const bucketObjectRepo = em.getRepository(BucketObject)

        // we need to make sure the "folder" hierarchy exists

        
        const path = req.params['0'];
        const paths = path.split("/") as string[];
        const bucketRef = em.getReference(Bucket, bucket as any)
        for(let i = 0; i < paths.length; i++){

            const fullPath = paths.slice(0, i + 1).join("/")
       
           
            const ghostObject = await bucketObjectRepo.findOne({bucket: bucketRef, filesize: 0, key: fullPath})

            if(!ghostObject){
                const newGhostObject = new BucketObject()
                newGhostObject.filesize = 0;
                newGhostObject.bucket = bucketRef
                newGhostObject.key = fullPath
                bucketObjectRepo.persistAndFlush(newGhostObject)
            }


        }

        const storagePath = Path.join("./", process.env.BUCKET_STORAGE_ROOT_DIR, bucket, ...paths)

        fs.mkdirSync(storagePath, {recursive: true})

        callback(null, storagePath)

    },
    filename: (req, file, callback) => {

        callback(null, `${req.params.filename}.${req.params.ext}`)
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

    @Get("/:bucket/*/:filename.:ext")
    public async getFromBucket(@Param("path") path: string, @Param("bucket") bucket: string, @Query("download") download: string, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){

        try{
            const em = request.db.em;

            const bucketObjectRepo = em.getRepository(BucketObject);

            const bucketRef = em.getReference(Bucket, bucket as any)

            const dbBucketObject = await bucketObjectRepo.findOne({key: path, bucket: bucketRef})

            if(!dbBucketObject){
                return res.status(404).json({success: false, err: `object with key ${bucket} does not exist`})
            }

            if(download === 'true'){

                const path = Path.join("./", process.env.BUCKET_STORAGE_ROOT_DIR, bucket, dbBucketObject.key);

                return res.status(200).sendFile(path)
            }


            return res.status(200).json({success: true, data: dbBucketObject})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to get object!'})
        }

    }

    @Delete("/:bucket/*")
    public async deleteFromBucket(@Param("0") path: string, @Param("bucket") bucket: string, @Res() res: Response, @Req() request: Request & {db: DatabaseService}){

        try{
           const em = request.db.em;

           const bucketRepo = em.getRepository(Bucket);

           if(await bucketRepo.count({key: bucket}) <= 0){
                return res.status(404).json({success: false, err: 'bucket does not exist!'})
           }

           const bucketObjectRepo = em.getRepository(BucketObject);

           const bucketRef = em.getReference(Bucket, bucket as any)

           await bucketObjectRepo.removeAndFlush({key: path, bucket: bucketRef})

           const objectPath = Path.join("./", process.env.BUCKET_STORAGE_ROOT_DIR, bucket, path);

           fs.unlinkSync(objectPath);

            return res.status(200).json({success: true})
        }catch(err){
            return res.status(500).json({success: false, err: 'failed to delete object!'})
        }

    }

    @Post("/:bucket/*/:filename.:ext")
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
    

    @Post("/:bucket/*")
    public async createNewFolder(@Param('bucket') bucket: string, @Param('0') path: string, @Next() next: any, @Res() response: Response, @Req() request: Request & {db: DatabaseService}){
        

        try{    

            const em = request.db.em;

            const paths = path.split("/") as string[];
            const bucketRef = em.getReference(Bucket, bucket as any)

            const bucketRepo = em.getRepository(Bucket);

            if(await bucketRepo.count({key: bucket}) <= 0){
                return response.status(404).json({success: false, error: 'bucket does not exist!'})
            }

            const bucketObjectRepo = em.getRepository(BucketObject)

            for(let i = 0; i < paths.length; i++){
    
                const fullPath = paths.slice(0, i + 1).join("/")
           
                const ghostObject = await bucketObjectRepo.findOne({bucket: bucketRef, filesize: 0, key: fullPath})
    
                if(!ghostObject){
                    const newGhostObject = new BucketObject()
                    newGhostObject.filesize = 0;
                    newGhostObject.bucket = bucketRef
                    newGhostObject.key = fullPath
                    bucketObjectRepo.persistAndFlush(newGhostObject)
                }
    
    
            }


            return response.status(200).json({success: true})
        }catch(err){
            return response.status(500).json({success: false, error: 'failed to create folder(s)'})
        }

    }

}


export interface NewBucket{
    key: string
    public: boolean
}


export class BucketNotFoundError extends Error{

}