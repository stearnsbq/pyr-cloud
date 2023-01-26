import express from 'express';
import {json} from 'body-parser'
import {Environment} from './model/Environment.enum'
import child_process from 'child_process'
import dotenv from 'dotenv';
import Path from 'path'

const app = express()

app.use(json())


const dev = true;

if(dev){
    dotenv.config();
}






app.post("/", async (req, res) => {

    // handle the func

    const eventBody = req.body;
    const environment = process.env.CODE_ENVIRONMENT;
    let functionSourceCodePath;

    let command;

    const args = [];


    switch(environment){
        case Environment.NODEJS:{
            command = "node";
            functionSourceCodePath = Path.join(__dirname, "base", "base.js")
            break;
        }
        case Environment.PYTHON:{
            command = "python";
            functionSourceCodePath = Path.join(__dirname, "base", "base.py")
            break;
        }
    }

    args.push(functionSourceCodePath)

    const child = child_process.spawn(command, args)

    const timeoutTimer = setTimeout(() => {
        child.kill(9)
        console.log("function timed out")
        res.status(502).json({success: false, err: 'function timed out'})
    }, parseInt(process.env.TIMEOUT))

    const funcOutput: string[] = [];

    child.stdout.on("data", (data) => {
        funcOutput.push(data.toString());
    })


    child.on("close", async (code, signal) => {
        if(signal === 'SIGKILL' || signal === 'SIGTERM'){
            return
        }

        for(let i = 0; i < funcOutput.length - 1; i++){
            if(funcOutput[i]){
                console.log(funcOutput[i].trim())
            }
        }

        try{
            const {statusCode, body, headers} = JSON.parse(funcOutput[funcOutput.length - 1]);

            const resBase = res.status(statusCode ?? 200);

            for(const [header, value] of Object.entries(headers)){
                resBase.setHeader(header, value as string)
            }

            resBase.json(body ?? {})
        
        }catch(err){
            console.log(err)
            res.status(502).json({success: false, err: 'unknown error'})
        } finally{
            clearTimeout(timeoutTimer)
        }
       
    })

    child.stdin.cork();
    child.stdin.write(JSON.stringify(eventBody));
    child.stdin.uncork();


})


// get the handler code



app.listen(8080, () => console.log('runner is running!'))



