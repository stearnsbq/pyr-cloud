import express from 'express';
import {json} from 'body-parser'
import dotenv from 'dotenv';
import Docker from 'dockerode';
import {IContainer} from './model/IContainer'
import {FunctionRequest} from './model/FunctionRequest'
import {DeployRequest} from './model/DeployRequest'

dotenv.config()

const app = express()
const DOCKER = new Docker({ host: process.env.DOCKER_HOST, port: process.env.DOCKER_PORT });

app.use(json())


// key: function name
// values: containers
const ContainerMap = new Map<string, IContainer[]>();



app.post("/:function", async (req, res) => {

    // check if we have any hot instances

    const body = req.body as FunctionRequest;

    if(!('sourceCodeURL' in body) || !('environment' in body)){
        return res.status(400);
    }

    const containers = ContainerMap.get(req.params.function) ?? [];

    let containerToUse: IContainer;

    if(!containers?.length){
        // cold start

        const container = await DOCKER.createContainer({Image: process.env.RUNNER_INSTANCE_IMAGE_NAME, Env: [`ENVIRONMENT=${body.environment}`, `TIMEOUT=${body?.timeout ?? 3000}`]});

        // start the container

        await container.start();

        containerToUse = {lastInvoke: new Date(), container}

        containers.push(containerToUse);

        ContainerMap.set(req.params.function, containers);
    
    }


    const info = await containerToUse.container.inspect();

    const containerAddress = info.NetworkSettings.IPAddress;

    const url = `http://${containerAddress}:8080`


    // make request

    const response = 
    fetch(url, {method: 'POST'})
    .then((res) => res.json())





});


// this endpoint will deploy a new function container image
app.post("/:function/deploy", async (req, res) => {

    const body = req.body as DeployRequest;

    if(!('sourceCodeURL' in body) || !('environment' in body)){
        return res.status(400);
    }

    // create new image!

   // DOCKER.buildImage()



})

app.listen(8080, () => console.log('runner is running!'))



