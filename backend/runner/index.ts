import express from 'express';
import {json} from 'body-parser'
import {Environment} from './model/Environment.enum'
import child_process from 'child_process'

const app = express()

app.use(json())




app.post("/", async (req, res) => {

    // handle the func

    const eventBody = req.body;

    const functionSourceCodePath = process.env.FUNCTION_SOURCE_CODE_PATH;
    const environment = process.env.CODE_ENVIRONMENT;

    let command;

    const args = [];


    switch(environment){
        case Environment.NODEJS:{
            command = "node";
            break;
        }
        case Environment.PYTHON:{
            command = "python";
            break;
        }
    }


    args.push(functionSourceCodePath)

    console.log("Running function");

    const child = child_process.spawn(command, args)

    setTimeout(() => {
        child.kill(9)
        console.log("function timed out")
        res.status(502).json({success: false, err: 'function timed out'})
    }, 3000)

    const funcOutput: string[] = [];

    child.stdout.on("data", (data) => {
        data = data.toString()
        funcOutput.push(data);
    })


    child.on("close", (code, signal) => {
        if(signal === 'SIGKILL' || signal === 'SIGTERM'){
            return
        }

        try{
            const {statusCode, body, headers} = JSON.parse(funcOutput[funcOutput.length - 1]);

            const resBase = res.status(statusCode ?? 200);

            for(const [header, value] of Object.entries(headers)){
                resBase.setHeader(header, value as string)
            }

            
            resBase.json(body ?? {})
        }catch(err){
            res.status(502).json({success: false, err: 'unknown error'})
        }
       
    })

    child.stdin.cork();
    child.stdin.write(JSON.stringify(eventBody));
    child.stdin.uncork();


})




app.listen(8080, () => console.log('runner is running!'))



